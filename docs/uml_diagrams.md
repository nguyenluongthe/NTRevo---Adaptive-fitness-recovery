# 📐 TÀI LIỆU SƠ ĐỒ THIẾT KẾ PHẦN MỀM UML (UML DIAGRAMS)
**Dự án:** NTRevo - Adaptive Fitness & Recovery Platform  
**Học phần:** Chương 5 - AI trong Thiết kế & Kiến trúc Phần mềm  
**Người thực hiện:** Dev 2 (`Dev2-FrontendQA`)  
**Mô hình áp dụng:** Clean Architecture (Domain, UseCase, Interface Adapters, Frameworks)  

---

## 1. SƠ ĐỒ TUẦN TỰ (UML SEQUENCE DIAGRAM): LUỒNG ĐIỀU CHỈNH THÍCH ỨNG UC04

Sơ đồ thể hiện chi tiết quá trình tương tác giữa Vận động viên, Giao diện người dùng, Tầng API Gateway, Application Service, Lõi AI Recovery Engine, và Kho lưu trữ Dữ liệu khi thực thi kịch bản: **"Điều chỉnh giáo án tập luyện tức thời dựa trên sự suy giảm HRV và thiếu ngủ"**.

```mermaid
sequenceDiagram
    autonumber
    actor Athlete as Vận động viên (Mobile/Web)
    participant Controller as WorkoutController (REST API)
    participant AuthGuard as JWT Security Interceptor
    participant AppService as AdaptiveWorkoutService
    participant BiometricRepo as IBiometricRepository
    participant Engine as AIRecoveryEngine (Strategy Pattern)
    participant Cache as Redis / In-Memory Cache
    participant DB as PostgreSQL Database

    Athlete->>Controller: GET /api/v1/workouts/today (Authorization: Bearer <Token>)
    Controller->>AuthGuard: Verify JWT Signature & Claims
    AuthGuard-->>Controller: Token Valid (UserID: "usr_998")

    Controller->>AppService: getDailyAdaptivePlan(userId="usr_998", date="2026-09-14")
    
    AppService->>Cache: getCachedPlan("plan:usr_998:2026-09-14")
    alt Có sẵn trong Cache (Cache Hit)
        Cache-->>AppService: Trả về AdaptiveWorkoutDTO
    else Cache Miss (Cần tính toán lại thích ứng)
        AppService->>BiometricRepo: getLatestBiometrics(userId="usr_998")
        BiometricRepo->>DB: SELECT * FROM biometric_logs WHERE user_id = ... ORDER BY recorded_at DESC LIMIT 1
        DB-->>BiometricRepo: Trả về {sleep_hours: 5.2, hrv_rmssd: 42, rhr: 74, doms_score: 7}
        BiometricRepo-->>AppService: BiometricLogEntity

        AppService->>Engine: computeReadinessAndPrescription(BiometricData, PlannedWorkout)
        Note over Engine: Thuật toán AI kiểm định:<br/>- HRV < Ngưỡng cơ sở 20% (-30đ)<br/>- Sleep < 6.0h (-20đ)<br/>- DOMS Đùi = 7 (-15đ)<br/>=> Readiness Score = 35/100 (HIGH FATIGUE)
        
        Engine-->>AppService: RecoveryPrescription {status: "OVERTRAINING_RISK", recommended_action: "DELOAD_ACTIVE_RECOVERY"}
        
        AppService->>AppService: modifyWorkoutStructure(original="Heavy Leg Day", prescription)
        Note over AppService: Thay thế Squat/Deadlift<br/>bằng Foam Rolling 15m + Đạp xe phục hồi vùng Zone 1
        
        AppService->>DB: INSERT INTO adaptive_logs (user_id, original_plan, modified_plan, reason)
        AppService->>Cache: setex("plan:usr_998:2026-09-14", 3600, PlanData)
    end

    AppService-->>Controller: Return Final AdaptiveWorkoutResponse
    Controller-->>Athlete: HTTP 200 OK (Kèm cảnh báo nguy cơ chấn thương màu Vàng/Đỏ)
```

---

## 2. SƠ ĐỒ LỚP (UML CLASS DIAGRAM): KIẾN TRÚC THỰC THỂ & DỊCH VỤ

Sơ đồ lớp biểu diễn cấu trúc hướng đối tượng theo nguyên tắc **SOLID**, phân tách ranh giới rõ rệt giữa Domain Model, Repository Interfaces, và Application Services:

```mermaid
classDiagram
    %% Domain Entities
    class User {
        +UUID id
        +String email
        +String passwordHash
        +String fullName
        +DateTime createdAt
        +validatePassword(String rawPassword) bool
    }

    class UserProfile {
        +UUID id
        +UUID userId
        +Float weightKg
        +Float heightCm
        +Integer trainingExperienceYears
        +String primaryGoal
        +calculateBMR() Float
    }

    class BiometricLog {
        +UUID id
        +UUID userId
        +DateTime recordedAt
        +Float sleepHours
        +Integer restingHeartRate
        +Float hrvRmssd
        +Integer subjectiveStressLevel
        +isHrvDepressed(Float baselineHrv) bool
    }

    class MusclePainEntry {
        +String muscleGroup
        +Integer painLevel
        +isSevere() bool
    }

    class ReadinessScore {
        +Integer scoreValue
        +String category
        +Float confidenceLevel
        +isDeloadRecommended() bool
    }

    class WorkoutSession {
        +UUID id
        +UUID userId
        +DateTime scheduledDate
        +String workoutType
        +String status
        +List~ExerciseSet~ exerciseSets
        +calculateTotalVolume() Float
        +calculateAverageRpe() Float
    }

    class ExerciseSet {
        +Integer setNumber
        +String exerciseName
        +Float weightKg
        +Integer repsCompleted
        +Float rpe
    }

    %% Interfaces
    class IBiometricRepository {
        <<interface>>
        +save(BiometricLog log) Future~void~
        +findLatestByUserId(UUID userId) Future~BiometricLog~
        +findWeeklyHistory(UUID userId) Future~List~BiometricLog~~
    }

    class IWorkoutRepository {
        <<interface>>
        +findTodayWorkout(UUID userId) Future~WorkoutSession~
        +saveSession(WorkoutSession session) Future~void~
    }

    class IRecoveryStrategy {
        <<interface>>
        +calculateReadiness(BiometricLog bio, List~MusclePainEntry~ pains) ReadinessScore
        +generatePrescription(ReadinessScore score) WorkoutPrescription
    }

    %% Concrete Strategies
    class HighFatigueRecoveryStrategy {
        +calculateReadiness(BiometricLog bio, List~MusclePainEntry~ pains) ReadinessScore
        +generatePrescription(ReadinessScore score) WorkoutPrescription
    }

    class OptimalTrainingStrategy {
        +calculateReadiness(BiometricLog bio, List~MusclePainEntry~ pains) ReadinessScore
        +generatePrescription(ReadinessScore score) WorkoutPrescription
    }

    %% Application Service
    class AdaptiveRecoveryService {
        -IBiometricRepository biometricRepo
        -IWorkoutRepository workoutRepo
        -IRecoveryStrategy recoveryStrategy
        +evaluateTodayReadiness(UUID userId) Future~ReadinessResponse~
        +adjustWorkoutVolume(UUID userId, WorkoutSession session) Future~WorkoutSession~
    }

    %% Relationships
    User "1" *-- "1" UserProfile : owns
    User "1" o-- "*" BiometricLog : records
    User "1" o-- "*" WorkoutSession : performs
    BiometricLog "1" *-- "*" MusclePainEntry : contains
    WorkoutSession "1" *-- "*" ExerciseSet : tracks
    
    AdaptiveRecoveryService ..> IBiometricRepository : depends on
    AdaptiveRecoveryService ..> IWorkoutRepository : depends on
    AdaptiveRecoveryService ..> IRecoveryStrategy : delegates calculation to
    
    IRecoveryStrategy <|.. HighFatigueRecoveryStrategy : implements
    IRecoveryStrategy <|.. OptimalTrainingStrategy : implements
    IRecoveryStrategy ..> ReadinessScore : produces
```

---

## 3. PHÂN TÍCH NGUYÊN LÝ THIẾT KẾ ÁP DỤNG (DESIGN PATTERNS & PRINCIPLES)

1. **Strategy Pattern (`IRecoveryStrategy`, `WorkoutStrategy`):**
   - Giúp tách biệt thuật toán tính điểm phục hồi và phương pháp tập luyện (Strength, HIIT, Cardio, Mobility) ra khỏi Service chính. Khi đội ngũ AI nâng cấp công thức hoặc bổ sung môn tập mới, chỉ cần tạo Class chiến lược mới mà không sửa đổi `AdaptiveRecoveryService` (Tuân thủ nguyên tắc **Open-Closed Principle**).
2. **Factory Pattern (`WorkoutStrategyFactory`):**
   - Khởi tạo động chiến lược tập luyện dựa trên tham số `session_type` và chỉ số `Readiness Score`, giải phóng Client khỏi việc phải phụ thuộc trực tiếp vào các lớp cụ thể.
3. **Specification Pattern (`SafeExerciseSpecification`):**
   - Đóng gói quy tắc nghiệp vụ kiểm tra tính an toàn của bài tập đối với các vùng cơ bị mỏi cấp tính (DOMS >= 7) thành các đối tượng có khả năng kết hợp logic (`AND`, `OR`, `NOT`).
4. **Dependency Inversion Principle (DIP):**
   - Tầng ứng dụng cấp cao `AdaptiveRecoveryService` chỉ phụ thuộc vào các Abstractions (`IBiometricRepository`, `IWorkoutRepository`, `IExerciseRepository`), không phụ thuộc trực tiếp vào Postgres Driver hay SQLite.
5. **Single Responsibility Principle (SRP):**
   - Lớp `BiometricLog` chỉ quản lý dữ liệu đo sinh học; lớp `ReadinessScore` chỉ chịu trách nhiệm phân loại ngưỡng cảnh báo (Optimal, Moderate, Deload).

---

## 4. SƠ ĐỒ TUẦN TỰ 2 (UML SEQUENCE DIAGRAM): LUỒNG LỌC BÀI TẬP AN TOÀN UC05 (DOMS SAFE FILTERING)

Sơ đồ thể hiện quá trình vận động viên yêu cầu giáo án tập luyện khi đang bị mỏi cơ vai (Shoulders DOMS = 8):

```mermaid
sequenceDiagram
    autonumber
    actor Athlete as Vận động viên (Web / Mobile)
    participant UI as Giao diện Thư viện (exercise-catalog)
    participant Controller as ExerciseController (REST API)
    participant UseCase as FilterSafeExercisesUseCase
    participant Spec as SafeExerciseSpecification
    participant Repo as JsonFileExerciseRepository
    participant Cache as MemoryCacheManager (Cache-Aside)
    participant Dataset as exercises.json (1,320+ bài tập)

    Athlete->>UI: Tìm bài tập hoặc kiểm tra an toàn theo nhóm cơ
    UI->>Controller: GET /api/v1/exercises/safe-filter?body_part=shoulders&sore_muscles=shoulders,quads
    
    Controller->>UseCase: execute(body_part="shoulders", sore_muscles=["shoulders", "quads"])
    
    UseCase->>Cache: get("exercises:safe:shoulders:quads,shoulders:12")
    alt Cache Hit (< 5ms)
        Cache-->>UseCase: Trả về kết quả JSON đã lọc từ bộ nhớ Cache
    else Cache Miss
        UseCase->>Repo: find_by_body_part("shoulders")
        Repo->>Dataset: Truy vấn danh sách bài tập theo chỉ mục body_part
        Dataset-->>Repo: [Barbell Overhead Press, Dumbbell Lateral Raise, Band Pull-Apart]
        Repo-->>UseCase: List<Exercise>
        
        loop Đánh giá từng bài tập
            UseCase->>Spec: is_satisfied_by(exercise)
            Note over Spec: Kiểm tra cơ đích & cơ bổ trợ:<br/>- Barbell Overhead Press tác động Shoulders (DOMS=8) => KHÔNG AN TOÀN<br/>- Band Pull-Apart: Giãn cơ phục hồi Zone 1 => AN TOÀN
            Spec-->>UseCase: True / False
        end
        
        UseCase->>Repo: Lấy bài tập thay thế nhẹ nhàng (Cardio Zone 1 / Mobility)
        Repo-->>UseCase: [Foam Rolling Upper Back, Shoulder Dislocation with Band]
        
        UseCase->>Cache: set(cache_key, result, ttl=1800)
    end

    UseCase-->>Controller: FilterResult {safe: 8, warnings: 4, substitutes: 2}
    Controller-->>UI: HTTP 200 OK (JSON ExerciseDTOs kèm nhãn Cảnh báo DOMS)
    UI-->>Athlete: Hiển thị Thẻ bài tập trực quan có GIF mô phỏng và huy hiệu an toàn
```

---

## 5. SƠ ĐỒ THÀNH PHẦN (UML COMPONENT DIAGRAM): PHÂN RÃ HỆ THỐNG CLEAN ARCHITECTURE

Sơ đồ biểu diễn 4 tầng kiến trúc phần mềm, nguyên tắc phụ thuộc một chiều và các giao diện Cổng & Bộ thích ứng (Ports & Adapters):

```mermaid
graph TD
    subgraph UI_Layer ["TẦNG 4: FRAMEWORKS & INFRASTRUCTURE (Tầng ngoài cùng)"]
        UI_Web["Web Frontend (HTML5 / Vanilla CSS / Glassmorphism)"]
        SwaggerUI["Swagger UI (swagger.html)"]
        NodeServer["Node.js / Python HTTP Server Gateway"]
        CacheDriver["MemoryCacheManager (In-Memory / Redis)"]
        DatabaseEngine["SQLite / PostgreSQL (Chuẩn 3NF)"]
        DatasetStore["exercises.json (1,320+ Dataset)"]
    end

    subgraph Adapters_Layer ["TẦNG 3: INTERFACE ADAPTERS"]
        ExerciseCtrl["ExerciseController"]
        RecoveryCtrl["RecoveryController"]
        WorkoutCtrl["WorkoutController"]
        ExerciseRepoImpl["JsonFileExerciseRepository"]
        BiometricRepoImpl["InMemoryBiometricRepository"]
        WorkoutRepoImpl["InMemoryWorkoutRepository"]
        DTOs["ExerciseDTO / ReadinessDTO Serializers"]
    end

    subgraph UseCases_Layer ["TẦNG 2: APPLICATION BUSINESS RULES (USE CASES)"]
        FilterSafeUC["FilterSafeExercisesUseCase"]
        CalcReadinessUC["CalculateReadinessUseCase"]
        GenWorkoutUC["GenerateAdaptiveWorkoutUseCase"]
        IExerciseRepo["<<interface>> IExerciseRepository"]
        IBiometricRepo["<<interface>> IBiometricRepository"]
        IWorkoutRepo["<<interface>> IWorkoutRepository"]
        ICachePort["<<interface>> ICacheService"]
    end

    subgraph Domain_Layer ["TẦNG 1: ENTERPRISE BUSINESS RULES (DOMAIN CORE)"]
        ExerciseEntity["Exercise Entity"]
        AthleteEntity["Athlete / User Entity"]
        BiometricEntity["BiometricSample Entity"]
        WorkoutEntity["WorkoutSession Entity"]
        ReadinessEntity["ReadinessScore Entity"]
        SafeSpec["SafeExerciseSpecification"]
        WorkoutStrategyBase["<<abstract>> WorkoutStrategy"]
        StrategyFactory["WorkoutStrategyFactory"]
    end

    %% Dependencies (Outside-In)
    UI_Web --> NodeServer
    SwaggerUI --> NodeServer
    NodeServer --> ExerciseCtrl
    NodeServer --> RecoveryCtrl
    NodeServer --> WorkoutCtrl

    ExerciseCtrl --> FilterSafeUC
    RecoveryCtrl --> CalcReadinessUC
    WorkoutCtrl --> GenWorkoutUC
    ExerciseCtrl --> DTOs

    FilterSafeUC --> IExerciseRepo
    FilterSafeUC --> ICachePort
    CalcReadinessUC --> IBiometricRepo
    CalcReadinessUC --> ICachePort
    GenWorkoutUC --> IWorkoutRepo

    ExerciseRepoImpl -.->|implements| IExerciseRepo
    BiometricRepoImpl -.->|implements| IBiometricRepo
    WorkoutRepoImpl -.->|implements| IWorkoutRepo
    CacheDriver -.->|implements| ICachePort

    ExerciseRepoImpl --> DatasetStore
    BiometricRepoImpl --> DatabaseEngine
    WorkoutRepoImpl --> DatabaseEngine

    FilterSafeUC --> SafeSpec
    FilterSafeUC --> ExerciseEntity
    CalcReadinessUC --> BiometricEntity
    CalcReadinessUC --> ReadinessEntity
    GenWorkoutUC --> StrategyFactory
    GenWorkoutUC --> WorkoutStrategyBase
    GenWorkoutUC --> WorkoutEntity

    style Domain_Layer fill:#27272A,stroke:#FF4500,stroke-width:2px,color:#FAFAFA
    style UseCases_Layer fill:#18181B,stroke:#3B82F6,stroke-width:2px,color:#FAFAFA
    style Adapters_Layer fill:#18181B,stroke:#10B981,stroke-width:2px,color:#FAFAFA
    style UI_Layer fill:#09090B,stroke:#64748B,stroke-width:2px,color:#FAFAFA
```

---

## 6. SƠ ĐỒ MÁY TRẠNG THÁI (UML STATE MACHINE DIAGRAM): VÒNG ĐỜI TRẠNG THÁI PHỤC HỒI & QUẢN TRỊ NGUY CƠ

Sơ đồ thể hiện chu trình tự điều chỉnh trạng thái tập luyện hàng ngày của Vận động viên:

```mermaid
stateDiagram-v2
    [*] --> OvernightSleep: Vận động viên đi ngủ & ghi nhận nhịp tim ban đêm

    OvernightSleep --> MorningCheckin: Thức dậy & Check-in sinh trắc học
    
    state MorningCheckin {
        [*] --> CollectSensors: Thu thập HRV, Sleep Hours, Deep Sleep %
        CollectSensors --> CollectSubjective: Nhập điểm đau mỏi cơ DOMS (1-10) & RPE
        CollectSubjective --> AIAlgorithmEvaluation: Chuyển dữ liệu vào Lõi AI Engine
    }

    MorningCheckin --> OptimalState: Readiness >= 80 (Phục hồi Tối ưu)
    MorningCheckin --> ModifiedState: 60 <= Readiness < 80 (Hồi phục Trung bình)
    MorningCheckin --> ActiveRecoveryState: 40 <= Readiness < 60 (Hồi phục Kém)
    MorningCheckin --> CompleteRestState: Readiness < 40 HOẶC Cảnh báo Quá tải (Overtraining Alert)

    state OptimalState {
        [*] --> FullLoadWorkout: Khối lượng 105%, Cường độ 100%
        FullLoadWorkout --> HighIntensityPush: Progressive Overload
    }

    state ModifiedState {
        [*] --> MaintainCompounds: Giữ nguyên bài tập phức hợp chính
        MaintainCompounds --> ReduceAccessories: Giảm 15% Volume bài tập bổ trợ
    }

    state ActiveRecoveryState {
        [*] --> PivotDeload: Hủy bỏ bài tập nặng Squat / Bench Press
        PivotDeload --> MobilityZone1: 30p Đạp xe Zone 1 + Giãn cơ toàn thân
    }

    state CompleteRestState {
        [*] --> OvertrainingLockout: Khóa lịch tập nặng, kích hoạt cảnh báo đỏ
        OvertrainingLockout --> NutritionSleepProtocol: Nghỉ ngơi thụ động, ngủ >= 8.5h
    }

    OptimalState --> ExecuteWorkoutSession: Bắt đầu buổi tập
    ModifiedState --> ExecuteWorkoutSession: Bắt đầu buổi tập
    ActiveRecoveryState --> ExecuteWorkoutSession: Bắt đầu buổi tập
    CompleteRestState --> NextDayCycle: Bỏ qua buổi tập hôm nay

    ExecuteWorkoutSession --> LogSetsRPE: Ghi nhận tải lượng từng set (Reps, Weight, RPE)
    LogSetsRPE --> CalculateDailyStrain: Tính tổng Training Load & ACWR
    CalculateDailyStrain --> NextDayCycle: Hoàn thành ngày tập

    NextDayCycle --> OvernightSleep: Chu kỳ ngày tiếp theo
```

---

## 7. SƠ ĐỒ CA SỬ DỤNG TỔNG QUAN (UML USE CASE DIAGRAM)

```mermaid
graph LR
    Athlete((Vận động viên))
    Coach((Huấn luyện viên))
    AISystem[<<System>> AI Recovery Engine]

    subgraph NTRevo_Platform ["Nền tảng Thể lực Thích ứng NTRevo"]
        UC01["UC01: Đăng nhập & Xác thực JWT"]
        UC02["UC02: Khởi tạo Hồ sơ Thể lực & Nhân trắc học"]
        UC03["UC03: Check-in Sinh trắc học & Đau mỏi DOMS"]
        UC04["UC04: AI Tự điều chỉnh Giáo án (Auto-regulation)"]
        UC05["UC05: Tra cứu Thư viện & Lọc Bài tập An toàn"]
        UC06["UC06: Ghi nhận Hiệp tập Real-time & Đo Volume"]
        UC07["UC07: Phân tích Xu hướng HRV & Cảnh báo ACWR"]
    end

    Athlete --> UC01
    Athlete --> UC02
    Athlete --> UC03
    Athlete --> UC04
    Athlete --> UC05
    Athlete --> UC06
    Athlete --> UC07

    Coach --> UC01
    Coach --> UC05
    Coach --> UC07

    UC03 --> AISystem
    AISystem --> UC04
    AISystem --> UC07
```

