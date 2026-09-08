# PHÂN TÍCH YÊU CẦU & MÔ HÌNH HÓA HỆ THỐNG NTREVO
**Dự án:** NTRevo - Adaptive Fitness & Recovery Platform  
**Học phần:** Chương 3.3 Phân tích Yêu cầu & Sơ đồ Hệ thống  

---

## 1. Sơ đồ Trường hợp Sử dụng (Use Case Diagram - NTRevo)

```mermaid
graph TD
    subgraph Users ["Các Tác nhân (Actors)"]
        ATHLETE["Vận động viên / Người tập"]
        COACH["Huấn luyện viên (Coach)"]
        AI["NTRevo AI Recovery Engine"]
    end

    subgraph System ["Hệ thống Phục hồi Thể lực NTRevo"]
        UC01["UC01: Ghi nhận Chỉ số Sinh học (Ngủ, Tim, Stress)"]
        UC02["UC02: Chọn Vùng Cơ Đau Mỏi trên Bản đồ DOMS"]
        UC03["UC03: Xem Điểm số Sẵn sàng (Readiness Score)"]
        UC04["UC04: Sinh Kế hoạch Phục hồi Thích ứng"]
        UC05["UC05: Xem Hướng dẫn Bài tập Kéo giãn & Lăn cơ"]
        UC06["UC06: Giám sát Chỉ số Phục hồi Toàn đội"]
        UC07["UC07: Nhận Cảnh báo Nguy cơ Chấn thương"]
    end

    ATHLETE --> UC01
    ATHLETE --> UC02
    ATHLETE --> UC03
    ATHLETE --> UC04
    ATHLETE --> UC05
    ATHLETE --> UC07

    COACH --> UC06
    COACH --> UC07

    UC03 -.-> |Tính toán đa biến| AI
    UC04 -.-> |Cá nhân hóa bài tập| AI
```

---

## 2. Sơ đồ Tuần tự: Luồng Đánh giá Thể lực & Đề xuất Hồi phục Thích ứng (Sequence Diagram)

Mô tả chi tiết luồng xử lý từ lúc người dùng mở ứng dụng buổi sáng đến khi nhận được kế hoạch phục hồi cá nhân hóa:

```mermaid
sequenceDiagram
    autonumber
    actor User as Vận động viên
    participant UI as Giao diện NTRevo Dashboard
    participant API as FastAPI Ingestion Gateway
    participant AI as AI Adaptive Recovery Engine
    participant DB as PostgreSQL & Cache

    User->>UI: Mở Dashboard & Nhập số giờ ngủ (7.5h), nhịp tim (58 bpm), chọn Đùi đau cấp độ 7
    User->>UI: Nhấn nút "🧠 Đánh giá Thể lực & Hồi phục Thích ứng"
    UI->>API: Gửi payload POST /api/v1/recovery/evaluate
    API->>DB: Truy vấn dữ liệu tập luyện 3 ngày trước (Training Load History)
    DB-->>API: Trả về lịch sử buổi tập nặng (Heavy Leg Day 24h trước)
    API->>AI: Chuyển toàn bộ dữ liệu chỉ số + lịch sử tải trọng
    Note over AI: 1. Tính toán Readiness Score (Ví dụ: 62/100 - Vùng Vàng)<br/>2. Phân tích nhóm cơ căng thẳng (Cơ tứ đầu đùi & Gân kheo)<br/>3. Sinh bài tập kéo giãn chuyên sâu & Bổ sung Magie
    AI-->>API: Trả về kết quả JSON (Điểm Readiness, Danh sách bài tập, Cảnh báo)
    API->>DB: Lưu nhật ký phục hồi (RecoveryLog)
    API-->>UI: Trả về HTTP 200 OK kèm dữ liệu phân tích
    UI-->>User: Hiển thị kim đồng hồ Readiness 62%, bản đồ cơ bắp sáng vùng đùi, và danh sách 3 bài giãn cơ 15 phút
```

---

## 3. Sơ đồ Máy Trạng thái Thể lực (State Machine: Athletic Recovery Lifecycle)

Mô tả chu trình biến đổi trạng thái thể chất của người tập:

```mermaid
stateDiagram-v2
    [*] --> Optimal: Cơ thể được nghỉ ngơi đầy đủ (Readiness 85-100)
    Optimal --> Fatigued: Sau buổi tập nặng cường độ cao (Hard Workout)
    
    Fatigued --> Recovering: Bắt đầu quy trình phục hồi thích ứng (Ngủ sâu, Giãn cơ)
    Recovering --> Optimal: Phục hồi hoàn tất sau 24-48 giờ
    
    Fatigued --> Overreached: Tiếp tục tập nặng khi cơ thể chưa kịp hồi phục (Readiness 40-60)
    Overreached --> Overtrained_Risk: Bỏ qua cảnh báo, điểm số < 40 kéo dài 48h
    
    Overtrained_Risk --> Deload_Rest: Kích hoạt chế độ nghỉ bắt buộc (Deload Week)
    Deload_Rest --> Recovering: Cơ bắp giảm viêm & Thần kinh hồi phục
```

---

## 4. Sơ đồ Mô hình Thực thể Quan hệ Dữ liệu (ERD - Data Model)

```mermaid
erDiagram
    USER ||--o{ BIOMETRICS_LOG : records
    USER ||--o{ WORKOUT_SESSION : logs
    BIOMETRICS_LOG ||--|| READINESS_EVALUATION : produces
    READINESS_EVALUATION ||--|{ RECOVERY_EXERCISE : recommends
    USER ||--o{ MUSCLE_SORENESS : experiences

    USER {
        string id PK
        string full_name
        string primary_sport "Gym | Running | Football"
        float resting_heart_rate_baseline
    }

    BIOMETRICS_LOG {
        string id PK
        string user_id FK
        date recorded_date
        float sleep_hours
        int sleep_quality "1 to 5"
        float heart_rate_variability_hrv
        int perceived_stress "1 to 10"
    }

    MUSCLE_SORENESS {
        string id PK
        string log_id FK
        string muscle_group "Quads | Hamstrings | Shoulders | Chest"
        int soreness_level "1 to 10"
    }

    READINESS_EVALUATION {
        string id PK
        string user_id FK
        int score "0 to 100"
        string category "Optimal | Caution | Rest"
        string ai_recommendation_summary
    }

    RECOVERY_EXERCISE {
        string id PK
        string evaluation_id FK
        string exercise_name "Pigeon Pose | Foam Rolling Quads"
        int duration_seconds
        string modality "Mobility | Cryotherapy | Breathing"
    }
```
