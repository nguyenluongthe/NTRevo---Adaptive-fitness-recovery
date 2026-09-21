# 📋 KẾ HOẠCH HÀNG TUẦN & PHÂN CHIA SPRINT CHI TIẾT (CHƯƠNG 3 → CHƯƠNG 9)
**Môn học:** Ứng dụng Trí tuệ Nhân tạo trong Kỹ nghệ Phần mềm  
**Dự án:** NTRevo - Adaptive Fitness & Recovery Platform  
**Phiên bản tài liệu:** 1.0.0  
**Ngày lập:** 08/09/2026  
**Mục tiêu:** Phân chia công việc cân bằng tuyệt đối (50% - 50%) cho nhóm 2 người, tối ưu hóa điểm đánh giá tự động từ Git Bot/Model (Commit history, Authorship, Branches, Peer Reviews, Conventional Commits).

---

## 👥 1. THÔNG TIN THÀNH VIÊN & PHÂN CHIA VAI TRÒ CHÍNH

| Thành viên | Tên cấu hình Git (Gợi ý) | Vai trò trong dự án | Trách nhiệm trọng tâm |
| :--- | :--- | :--- | :--- |
| **Thành viên 1 (Dev 1)** | `Dev1-BackendLead` | Backend Lead & AI Core Architecture | Thiết kế CSDL (3NF, ERD), Kiến trúc Clean Architecture, Thuật toán AI Recovery Engine, Unit/Integration Testing (Pytest), Performance Caching & ADR |
| **Thành viên 2 (Dev 2)** | `Dev2-FrontendQA` | Frontend Lead & QA/BA Specialist | Phân tích INVEST/Gherkin BDD, Thiết kế UI/UX Dark Mode (`#09090B`, Accent `#FF4500`), Frontend Reactive State, E2E Testing, AI PR Review Bot & Onboarding |

---

## 🌿 2. QUY ƯỚC GITFLOW & NGUYÊN TẮC REVIEW CHÉO (PEER REVIEW)

### 2.1 Cấu trúc nhánh chính
- `main`: Chỉ chứa các bản phát hành ổn định sau mỗi tuần (gắn tag phiên bản).
- `develop`: Nhánh tích hợp chung mã nguồn của cả hai thành viên.
- **Quy tắc đặt tên nhánh hàng tuần:**
  - Dev 1: `feat/w<so_tuan>-dev1-<ten_tinh_nang>`
  - Dev 2: `feat/w<so_tuan>-dev2-<ten_tinh_nang>`

### 2.2 Quy ước Commit (Conventional Commits)
Mỗi commit bắt buộc theo format: `<type>(<scope>): <mô tả ngắn bằng tiếng Anh>`
- `feat`: Tính năng mới
- `docs`: Tài liệu, sơ đồ Mermaid, PRD, User Stories
- `test`: Viết kịch bản test (Unit, Integration, E2E, Gherkin)
- `refactor`: Tái cấu trúc mã nguồn (SOLID, Code smells)
- `ci`: Cấu hình GitHub Actions, bot tự động hóa
- `ops`: Cấu hình Docker, deployment script

### 2.3 Tiêu chí nghiệm thu Review chéo (Peer Review PR)
1. Mỗi tuần, mỗi dev tạo **1 Pull Request** từ nhánh tính năng vào `develop`.
2. Thành viên còn lại bắt buộc vào tab "Files changed", để lại **ít nhất 1-2 nhận xét kỹ thuật có giá trị** (chất lượng mã, logic thuật toán, tiêu chuẩn WCAG, coverage).
3. Bấm **Approve** trước khi thực hiện hành động merge (Squash & Merge hoặc Merge Commit).

---

## 📅 3. CHI TIẾT 7 SPRINT TỪ CHƯƠNG 3 ĐẾN CHƯƠNG 9 (50% - 50%)

```
[Sprint 1: Phân tích & PRD] ─── (Chương 3)
            │
[Sprint 2: UI/UX & Wireframe] ── (Chương 4)
            │
[Sprint 3: Kiến trúc & DB 3NF] ── (Chương 5)
            │
[Sprint 4: AI Lập trình CodeGen] ─ (Chương 6)
            │
[Sprint 5: Refactor & Bot Review] ─ (Chương 7)
            │
[Sprint 6: Kiểm thử Unit/E2E] ──── (Chương 8)
            │
[Sprint 7: Tài liệu & Release v1.0] (Chương 9)
```

---

### 📍 SPRINT 1: AI TRONG PHÂN TÍCH YÊU CẦU & SẢN PHẨM (TUẦN 1 - CHƯƠNG 3)
* **Ánh xạ SRS:** FR-001 đến FR-007, FR-010, UC01, UC02, NFR-P01 đến P04.
* **Mục tiêu:** Chuyển hóa SRS thành PRD kỹ thuật, danh mục User Stories chuẩn INVEST, đặc tả thuật toán và dựng khung layout cơ bản.

#### 🔹 Dev 1: Backend Lead & AI Core
* **Nhánh Git:** `feat/w1-dev1-discovery-prd`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 1, tôi có thể* dùng AI phân tích Product Discovery và soạn thảo PRD kỹ thuật chi tiết (`docs/PRD_Technical_Spec.md`) cho các phân hệ Fitness & Recovery.
  * *Là Dev 1, tôi có thể* dùng AI xây dựng tài liệu đặc tả thuật toán lõi AI Recovery Engine và công thức tính FitnessScore™ (FR-004, FR-010).
  * *Là Dev 1, tôi có thể* khởi tạo bộ khung mã nguồn Backend (REST API Router Skeleton) và định nghĩa các route nháp cho Auth & Assessment.
* **Danh sách Commit mẫu:**
  1. `docs(prd): generate comprehensive technical PRD using AI assistant`
  2. `docs(spec): specify AI recovery algorithm and fitness score formula`
  3. `feat(backend): initialize backend project structure and route skeleton`
  4. `docs(api): draft initial API contract for assessment and auth modules`
* **Sản phẩm bàn giao:** `docs/PRD_Technical_Spec.md`, `docs/recovery_engine_spec.md`, source code khung Backend.

#### 🔸 Dev 2: Frontend Lead & QA/BA
* **Nhánh Git:** `feat/w1-dev2-userstories-ac`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 2, tôi có thể* dùng AI phân rã 20 Functional Requirements thành danh mục User Stories chuẩn **INVEST** kèm Acceptance Criteria.
  * *Là Dev 2, tôi có thể* dùng AI viết kịch bản kiểm thử hành vi **BDD Gherkin** cho UC01 (Khởi tạo hồ sơ) và UC02 (Tạo kế hoạch tập thích nghi).
  * *Là Dev 2, tôi có thể* dựng khung giao diện ban đầu (Mockup HTML/CSS) cho Dashboard tổng quan và màn hình AI Generator theo phong cách Premium Dark Mode (`#09090B`, Accent `#FF4500`).
* **Danh sách Commit mẫu:**
  1. `docs(ba): breakdown SRS into INVEST user stories with AI prompts`
  2. `test(gherkin): generate BDD scenarios for UC01 onboarding and UC02 plan generation`
  3. `feat(ui): scaffold dark mode dashboard layout with zinc and orange theme`
  4. `feat(ui): implement mockup interface for AI recovery generator page`
* **Sản phẩm bàn giao:** `docs/User_Stories_INVEST.md`, `tests/features/onboarding_plan.feature`, `mockup/index.html`, `mockup/ai-generator.html`.

🤝 **Quy trình Review chéo Tuần 1:**
* **Dev 1 review Dev 2:** Đối chiếu kịch bản Gherkin xem có khả thi về mặt kỹ thuật và logic backend không; kiểm tra mã màu `#09090B`, `#18181B`, `#FF4500` đã chuẩn theo mục 3.5 SRS chưa.
* **Dev 2 review Dev 1:** Đọc PRD kỹ thuật và đặc tả API nháp để đảm bảo đáp ứng trọn vẹn các tiêu chí chấp nhận (Acceptance Criteria) đã viết trong User Stories.

---

### 📍 SPRINT 2: AI TRONG THIẾT KẾ SẢN PHẨM & UI/UX (TUẦN 2 - CHƯƠNG 4)
* **Ánh xạ SRS:** Mục 3.5 Usability & UI/UX (WCAG 2.1 AA, Glassmorphism, Viền `#27272A`), UC01-UC04.
* **Mục tiêu:** Thiết kế wireframe linh hoạt từ AI, sơ đồ luồng người dùng Mermaid và chạy audit kiểm tra độ tương phản tiếp cận WCAG.

#### 🔹 Dev 1: Backend Lead & AI Core
* **Nhánh Git:** `feat/w2-dev1-ai-wireframe`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 1, tôi có thể* dùng AI sinh cấu trúc Component Wireframe dưới dạng JSON Schema (`design/wireframe_schema.json`) cho màn hình Fitness Assessment (FR-003) và Workout Tracker (FR-008).
  * *Là Dev 1, tôi có thể* xây dựng bộ parser/renderer hiển thị wireframe động từ file cấu hình JSON, hỗ trợ hiển thị các form nhập số reps, weights, RPE.
  * *Là Dev 1, tôi có thể* định nghĩa Mock Data Store sinh trắc học để người dùng có thể tương tác thử nghiệm các bài test thể lực trên bản prototype.
* **Danh sách Commit mẫu:**
  1. `feat(wireframe): generate dynamic JSON component schema using AI`
  2. `feat(prototype): render assessment wireframe from JSON schema layout`
  3. `feat(mock): add mock biometric datastore for workout tracking layout`
  4. `docs(wireframe): document component hierarchy and layout rationale`
* **Sản phẩm bàn giao:** `design/wireframe_schema.json`, module hiển thị wireframe động, mock dataset.

#### 🔸 Dev 2: Frontend Lead & QA/BA
* **Nhánh Git:** `feat/w2-dev2-userflow-review`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 2, tôi có thể* dùng AI sinh sơ đồ luồng người dùng toàn diện (**Mermaid User Flow**) bao quát từ lúc mở app, đánh giá thể lực, tập luyện, đến khi nhận cảnh báo Overtraining.
  * *Là Dev 2, tôi có thể* xây dựng script/prompt AI Design Review đánh giá mức độ tương phản màu sắc và khả năng tiếp cận đạt chuẩn **WCAG 2.1 AA**.
  * *Là Dev 2, tôi có thể* hoàn thiện bản mẫu tương tác Prototype, ứng dụng hiệu ứng Glassmorphism trên nền Elevated Dark (`#18181B`) với viền `#27272A`.
* **Danh sách Commit mẫu:**
  1. `docs(ux): generate comprehensive Mermaid user flow diagrams with AI`
  2. `ci(design): implement AI design review script to audit WCAG 2.1 compliance`
  3. `feat(ui): apply glassmorphism cards and border styling to prototype`
  4. `docs(report): publish automated accessibility and contrast audit report`
* **Sản phẩm bàn giao:** `docs/user_flows.md`, `reports/wcag_compliance_report.md`, giao diện prototype hoàn thiện.

🤝 **Quy trình Review chéo Tuần 2:**
* **Dev 1 review Dev 2:** Rà soát các luồng ngoại lệ trong User Flow (ví dụ: người dùng chấn thương vùng gối thì flow tránh bài squat ra sao).
* **Dev 2 review Dev 1:** Kiểm tra tính mở rộng của JSON Wireframe Schema để đảm bảo dễ dàng binding dữ liệu vào DOM/CSS.

---

### 📍 SPRINT 3: AI TRONG THIẾT KẾ & KIẾN TRÚC PHẦN MỀM (TUẦN 3 - CHƯƠNG 5)
* **Ánh xạ SRS:** Mục 5 (Core Data Entities), NFR-Security, NFR-Scalability, OpenAPI 3.0.
* **Mục tiêu:** Xây dựng kiến trúc Clean Architecture, lược đồ CSDL chuẩn 3NF và bộ tài liệu hợp đồng OpenAPI 3.0.

#### 🔹 Dev 1: Backend Lead & AI Core
* **Nhánh Git:** `feat/w3-dev1-architecture-db`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 1, tôi có thể* dùng AI thiết kế ranh giới phân tầng Clean Architecture (Domain, UseCase, Repository, Controller).
  * *Là Dev 1, tôi có thể* dùng AI sinh mã nguồn SQL DDL chuẩn **3NF** bao gồm 8 bảng thực thể cốt lõi theo mục 5 SRS (`Users`, `UserProfile`, `FitnessAssessment`, `TrainingPlan`, `Workout`, `ExerciseSet`, `RecoveryLog`, `ProgressMetric`).
  * *Là Dev 1, tôi có thể* dùng AI tạo sơ đồ quan hệ thực thể **Mermaid ERD** chi tiết khóa chính, khóa ngoại, ràng buộc quan hệ và viết script dữ liệu mẫu (`seeds.sql`).
* **Danh sách Commit mẫu:**
  1. `docs(arch): define clean architecture layer boundaries with AI guidance`
  2. `feat(db): generate 3NF relational database schema DDL via AI prompt`
  3. `feat(db): create database seed script with mock fitness and recovery data`
  4. `docs(erd): visualize complete database relationships with Mermaid ERD`
* **Sản phẩm bàn giao:** `database/schema.sql`, `database/seeds.sql`, `docs/ERD_diagram.md`.

#### 🔸 Dev 2: Frontend Lead & QA/BA
* **Nhánh Git:** `feat/w3-dev2-uml-api-patterns`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 2, tôi có thể* dùng AI sinh sơ đồ **UML Sequence Diagram** cho luồng UC04 (Điều chỉnh kế hoạch thích nghi dựa trên HRV và giấc ngủ).
  * *Là Dev 2, tôi có thể* dùng AI sinh sơ đồ **UML Class Diagram** biểu diễn cấu trúc dữ liệu và các giao tiếp Interface trong hệ thống.
  * *Là Dev 2, tôi có thể* dùng AI biên soạn bộ tài liệu đặc tả hợp đồng API đầy đủ chuẩn **OpenAPI 3.0 (Swagger YAML)** cho hơn 15 endpoints và dựng trang Swagger UI xem trực tiếp.
* **Danh sách Commit mẫu:**
  1. `docs(uml): generate adaptive workout sequence diagram using AI prompts`
  2. `docs(uml): generate domain entity and service class diagrams in Mermaid`
  3. `docs(api): compose full OpenAPI 3.0 swagger specification file`
  4. `feat(docs): setup interactive Swagger UI viewer for API validation`
* **Sản phẩm bàn giao:** `docs/uml_diagrams.md`, `api/openapi_spec.yaml`, giao diện kiểm thử Swagger UI.

🤝 **Quy trình Review chéo Tuần 3:**
* **Dev 1 review Dev 2:** So khớp từng trường `schema` trong `openapi_spec.yaml` với tên cột trong `schema.sql` để đảm bảo đồng nhất 100%.
* **Dev 2 review Dev 1:** Kiểm tra các khóa ngoại (Foreign Keys) và quy tắc `ON DELETE CASCADE` trong CSDL nhằm tránh lỗi toàn vẹn dữ liệu khi xóa User.

---

### 📍 SPRINT 4: AI LẬP TRÌNH - CODE GENERATION & COMPLETION (TUẦN 4 - CHƯƠNG 6)
* **Ánh xạ SRS:** FR-005, FR-006, FR-008, FR-010, FR-016, Mục 6 (AI Engine), NFR-P01/P02.
* **Mục tiêu:** Sinh mã nguồn logic thuật toán AI thích nghi, xử lý State Management và biểu đồ sinh trắc học thời gian thực.

#### 🔹 Dev 1: Backend Lead & AI Core
* **Nhánh Git:** `feat/w4-dev1-codegen-backend`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 1, tôi có thể* sử dụng AI Pair Programming để sinh mã nguồn thuật toán tính **Recovery Score (0-100)** dựa trên trọng số biến thiên nhịp tim HRV (40%), Giấc ngủ (30%), RPE (15%), DOMS (15%).
  * *Là Dev 1, tôi có thể* dùng AI viết thuật toán điều chỉnh thích nghi (Adaptive Engine): tự động tăng/giảm volume bài tập, đề xuất phân loại ngày (Full/Modified/Active Recovery/Rest).
  * *Là Dev 1, tôi có thể* lập trình lớp bộ nhớ đệm Caching (In-memory/Redis) để đảm bảo thời gian tạo kế hoạch AI đạt ngưỡng < 2 giây (đáp ứng NFR-P02).
* **Danh sách Commit mẫu:**
  1. `feat(core): implement recovery score algorithm generated with AI assistance`
  2. `feat(core): build adaptive volume and intensity adjustment rules engine`
  3. `feat(cache): implement in-memory caching layer for sub-2s query latency`
  4. `docs(pair): document AI pair programming prompts and completion log`
* **Sản phẩm bàn giao:** `src/backend/services/recovery_engine.py` (hoặc `.js`), `src/backend/cache/`, `docs/ai_pair_programming_log.md`.

#### 🔸 Dev 2: Frontend Lead & QA/BA
* **Nhánh Git:** `feat/w4-dev2-codegen-frontend`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 2, tôi có thể* dùng AI sinh mã nguồn module quản lý trạng thái Frontend (Reactive State Store: lưu User profile, bài tập đang diễn ra và Recovery score).
  * *Là Dev 2, tôi có thể* dùng AI lập trình module vẽ biểu đồ tương tác: Biểu đồ xu hướng HRV 7 ngày và biểu đồ tải lượng tập luyện Training Load (FR-016) trên Canvas/SVG.
  * *Là Dev 2, tôi có thể* lập trình tầng API Client Interceptor xử lý gắn JWT Token, tự động retry khi mất mạng tạm thời và bắt lỗi ngoại lệ tập trung.
* **Danh sách Commit mẫu:**
  1. `feat(state): generate reactive frontend store module using AI pair coding`
  2. `feat(chart): implement interactive HRV and training load charts via Canvas/Chart.js`
  3. `feat(api): build API client with unified request interceptors and error handler`
  4. `feat(ui): connect live workout logging interface with reactive state`
* **Sản phẩm bàn giao:** `src/frontend/js/store.js`, `src/frontend/js/chart_engine.js`, `src/frontend/js/api_client.js`.

🤝 **Quy trình Review chéo Tuần 4:**
* **Dev 1 review Dev 2:** Kiểm tra hiệu năng render biểu đồ trên thiết bị di động, kiểm tra format dữ liệu gửi lên API ghi nhận buổi tập.
* **Dev 2 review Dev 1:** Kiểm tra các trường hợp biên của thuật toán tính điểm phục hồi (ví dụ: người dùng mất ngủ HRV tụt sốc thì thuật toán có ép ngày Complete Rest không).

---

### 📍 SPRINT 5: TÁI CẤU TRÚC & REVIEW MÃ NGUỒN CÙNG AI (TUẦN 5 - CHƯƠNG 7)
* **Ánh xạ SRS:** NFR-Maintainability (SOLID, Code Smells), NFR-Reliability (Uptime, Uptime logic), CI/CD.
* **Mục tiêu:** Rà soát và loại bỏ Code Smells bằng AI, áp dụng nguyên lý SOLID và xây dựng bot tự động review code trên GitHub Actions.

#### 🔹 Dev 1: Backend Lead & AI Core
* **Nhánh Git:** `feat/w5-dev1-refactor-smells`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 1, tôi có thể* dùng AI quét toàn bộ mã nguồn Backend để phát hiện các Code Smells (Long Method, Feature Envy, Primitive Obsession, Hardcoded Numbers).
  * *Là Dev 1, tôi có thể* tái cấu trúc thuật toán thích nghi theo nguyên lý **SOLID**: áp dụng Strategy Pattern cho các phương pháp tập (Strength, HIIT, Cardio) và Factory Pattern để khởi tạo Workout.
  * *Là Dev 1, tôi có thể* loại bỏ mã nguồn trùng lặp (DRY) và lập báo cáo so sánh chất lượng mã nguồn trước và sau khi refactor (`refactoring_report.md`).
* **Danh sách Commit mẫu:**
  1. `refactor(core): extract workout strategy pattern to eliminate long methods`
  2. `refactor(solid): apply single responsibility principle to recovery calculators`
  3. `refactor(clean): eliminate hardcoded scoring coefficients with config providers`
  4. `docs(refactor): compile comprehensive AI code smell detection report`
* **Sản phẩm bàn giao:** Mã nguồn backend sau refactor, `docs/refactoring_solid_report.md`.

#### 🔸 Dev 2: Frontend Lead & QA/BA
* **Nhánh Git:** `feat/w5-dev2-ai-code-review-bot`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 2, tôi có thể* lập trình kịch bản tự động `ai_code_reviewer.py` kết nối với AI API để phân tích thay đổi (Git Diff) trong các Pull Request.
  * *Là Dev 2, tôi có thể* cấu hình **GitHub Actions Workflow** tự động kích hoạt bot khi có PR mới, tính toán điểm Clean Code Score (1-100) và kiểm tra chuẩn WCAG/Naming Convention.
  * *Là Dev 2, tôi có thể* lập trình tính năng tự động gửi bình luận (PR Comment) chứa các gợi ý sửa code cụ thể trực tiếp lên giao diện GitHub Pull Request.
* **Danh sách Commit mẫu:**
  1. `ci(bot): create automated AI code review script using LLM API`
  2. `ci(github): configure GitHub Actions workflow triggered on pull requests`
  3. `feat(bot): add automatic PR comment generation with diff suggestions`
  4. `docs(bot): document AI review bot ruleset, prompts, and score threshold`
* **Sản phẩm bàn giao:** `.github/workflows/ai_review.yml`, `scripts/ai_code_reviewer.py`, tài liệu hướng dẫn bot.

🤝 **Quy trình Review chéo Tuần 5:**
* **Dev 1 review Dev 2:** Mở một Pull Request thử nghiệm để kích hoạt Bot AI Review, kiểm tra tính xác thực và hữu ích của các nhận xét do bot sinh ra.
* **Dev 2 review Dev 1:** Đọc lại các class và interface sau khi áp dụng Design Pattern, xác nhận mã nguồn đã tinh gọn, dễ bảo trì và dễ viết test.

---

### 📍 SPRINT 6: AI TRONG KIỂM THỬ PHẦN MỀM (TUẦN 6 - CHƯƠNG 8)
* **Ánh xạ SRS:** NFR-Maintainability (Test coverage $\ge 80\%$), Toàn bộ 20 FRs, UC01 đến UC05.
* **Mục tiêu:** Sinh bộ kiểm thử tự động Unit/Integration Test đạt Coverage $\ge 85\%$, sinh kịch bản E2E Test và lập bảng Traceability Matrix.

#### 🔹 Dev 1: Backend Lead & AI Core
* **Nhánh Git:** `feat/w6-dev1-ai-unit-integration`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 1, tôi có thể* dùng AI sinh tự động bộ kiểm thử đơn vị (**Unit Tests** bằng Pytest/Jest) bao phủ 100% các hàm tính điểm Recovery Score, Fitness Score và phân bổ tải lượng tập.
  * *Là Dev 1, tôi có thể* dùng AI sinh các ca kiểm thử tích hợp (**Integration Tests**) kiểm tra tính toàn vẹn của chuỗi API: Xác thực -> Đánh giá ban đầu -> Tạo bài tập -> Lưu buổi tập.
  * *Là Dev 1, tôi có thể* thiết lập công cụ đo lường và tạo báo cáo chứng minh tỷ lệ bao phủ kiểm thử đạt **$\ge 85\%$** (vượt ngưỡng 80% của SRS).
* **Danh sách Commit mẫu:**
  1. `test(unit): generate exhaustive test suite for recovery engine using AI`
  2. `test(integration): create end-to-end API route integration tests`
  3. `test(edge): add boundary condition tests for extreme biometric inputs`
  4. `docs(coverage): generate test coverage report demonstrating 88% codebase coverage`
* **Sản phẩm bàn giao:** Thư mục `tests/unit/`, `tests/integration/`, `reports/coverage_report.html`.

#### 🔸 Dev 2: Frontend Lead & QA/BA
* **Nhánh Git:** `feat/w6-dev2-ai-e2e-automation`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 2, tôi có thể* dùng AI sinh kịch bản kiểm thử đầu cuối tự động (**E2E Tests** bằng Playwright/Cypress) mô phỏng hành trình người dùng thực tế: Đăng ký -> Điền thông tin thể lực -> Xem lịch tập -> Đánh dấu hoàn thành bài tập.
  * *Là Dev 2, tôi có thể* dùng AI đối soát và lập bảng **Ma trận truy vết kiểm thử (Test Traceability Matrix)** ánh xạ 1-1 từ 20 FRs sang User Stories và ID của từng Test Case.
  * *Là Dev 2, tôi có thể* cấu hình tích hợp chạy bộ test E2E trong GitHub Actions và xuất video/bằng chứng kiểm thử tự động.
* **Danh sách Commit mẫu:**
  1. `test(e2e): generate automated Playwright user journey tests with AI`
  2. `docs(qa): compile comprehensive Test Traceability Matrix mapping all FRs`
  3. `ci(test): integrate automated E2E test execution into CI pipeline`
  4. `docs(report): generate automated testing summary report and bug log`
* **Sản phẩm bàn giao:** Thư mục `tests/e2e/`, `docs/test_traceability_matrix.md`, video demo kiểm thử E2E.

🤝 **Quy trình Review chéo Tuần 6:**
* **Dev 1 review Dev 2:** Kiểm tra ma trận truy vết Traceability Matrix để xác nhận không có yêu cầu chức năng hoặc phi chức năng nào bị bỏ sót.
* **Dev 2 review Dev 1:** Chạy bộ test Unit/Integration trên máy tính cá nhân để xác minh tỷ lệ Pass đạt 100% không có lỗi flaky test.

---

### 📍 SPRINT 7: AI TRONG SINH TÀI LIỆU KỸ THUẬT & BÀN GIAO (TUẦN 7 - CHƯƠNG 9)
* **Ánh xạ SRS:** 1.3 Các bên liên quan, Mục 8 (Lộ trình phát triển), Nghiệm thu và Release v1.0.0.
* **Mục tiêu:** Hoàn thiện hồ sơ tài liệu kiến trúc (ADR), quy trình triển khai (Runbook), hướng dẫn onboarding, đóng gói Docker và gắn thẻ phát hành chính thức.

#### 🔹 Dev 1: Backend Lead & AI Core
* **Nhánh Git:** `feat/w7-dev1-tech-docs-adr`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 1, tôi có thể* dùng AI sinh bộ hồ sơ Quyết định Kiến trúc (**ADR - Architecture Decision Records**) lý giải các lựa chọn: CSDL quan hệ chuẩn 3NF, Kiến trúc Clean Architecture, Cơ chế Cache.
  * *Là Dev 1, tôi có thể* dùng AI viết tài liệu Vận hành & Triển khai (**Deployment Runbook**), cấu hình file `Dockerfile` và `docker-compose.yml` để khởi chạy toàn bộ hệ thống bằng 1 lệnh duy nhất.
  * *Là Dev 1, tôi có thể* xuất và hoàn thiện bộ tài liệu API tĩnh (HTML/Markdown) phục vụ lưu trữ bàn giao nghiệm thu.
* **Danh sách Commit mẫu:**
  1. `docs(adr): generate architecture decision records for DB and AI engine`
  2. `ops(docker): build multi-stage Dockerfile and docker-compose deployment script`
  3. `docs(ops): write comprehensive deployment runbook and maintenance guide`
  4. `docs(release): compile final API documentation and environment spec`
* **Sản phẩm bàn giao:** `docs/ADR/`, `docs/DEPLOYMENT_RUNBOOK.md`, `Dockerfile`, `docker-compose.yml`.

#### 🔸 Dev 2: Frontend Lead & QA/BA
* **Nhánh Git:** `feat/w7-dev2-onboarding-guide`
* **Năng lực & Trách nhiệm (User Story format):**
  * *Là Dev 2, tôi có thể* dùng AI sinh tài liệu Hướng dẫn Lập trình viên mới (**Developer Onboarding Guide**) giúp cài đặt môi trường và chạy thử dự án trong dưới 15 phút.
  * *Là Dev 2, tôi có thể* dùng AI soạn thảo kịch bản thuyết trình và slide bảo vệ đồ án (Slide Deck Outline) làm nổi bật toàn bộ các ứng dụng AI qua 7 tuần.
  * *Là Dev 2, tôi có thể* cùng Dev 1 thực hiện merge nhánh `develop` vào `main`, kiểm tra tính toàn vẹn và tạo Release Tag chính thức **`v1.0.0`** trên GitHub.
* **Danh sách Commit mẫu:**
  1. `docs(dev): generate 15-minute developer onboarding guide with AI`
  2. `docs(slide): generate comprehensive project defense presentation script`
  3. `chore(release): merge develop into main and prepare v1.0.0 release changelog`
  4. `chore(tag): tag official release v1.0.0 for academic defense`
* **Sản phẩm bàn giao:** `docs/DEVELOPER_ONBOARDING.md`, `presentation/slide_deck.md`, `CHANGELOG.md`, Release Tag `v1.0.0`.

🤝 **Quy trình Review chéo Tuần 7:**
* **Dev 1 review Dev 2:** Đọc thử tài liệu Onboarding và làm theo từng bước để đảm bảo một lập trình viên mới hoàn toàn có thể chạy được dự án.
* **Dev 2 review Dev 1:** Chạy thử `docker-compose up` trên máy sạch để xác nhận hệ thống khởi động thành công, kiểm tra lại toàn bộ link tài liệu ADR.

---

## 📊 4. BẢNG THEO DÕI ĐÓNG GÓP TOÀN DỰ ÁN (CHỈ SỐ 50% - 50%)

| Tiêu chí đo lường của Bot Git | Thành viên 1 (`Dev1-BackendLead`) | Thành viên 2 (`Dev2-FrontendQA`) | Tỷ lệ đạt được |
| :--- | :---: | :---: | :---: |
| **Số nhánh tính năng độc lập** | 7 nhánh (`feat/w1..7-dev1-*`) | 7 nhánh (`feat/w1..7-dev2-*`) | **50% - 50%** |
| **Số lượng Commits (ước tính)** | 28 - 35 commits (4-5 commit/tuần) | 28 - 35 commits (4-5 commit/tuần) | **Cân bằng tuyệt đối** |
| **Số lượng Pull Requests tạo** | 7 PRs vào `develop` | 7 PRs vào `develop` | **1 : 1** |
| **Số lượng Pull Requests Review** | 7 PRs của Dev 2 (Approve) | 7 PRs của Dev 1 (Approve) | **100% Chéo** |
| **Độ phủ vai trò kỹ thuật** | Backend, CSDL, AI Core, Unit Test, DevOps | Frontend, BA/INVEST, Gherkin, E2E, AI Review Bot | **Bù trừ toàn diện** |

---

## 🛠️ 5. HƯỚNG DẪN CẤU HÌNH NHANH MÔI TRƯỜNG GIT CHO 2 DEV

### Cấu hình cho Máy của Dev 1:
```bash
git config --global user.name "Dev1-BackendLead"
git config --global user.email "dev1@ntrevo-fitness.local"
```

### Cấu hình cho Máy của Dev 2:
```bash
git config --global user.name "Dev2-FrontendQA"
git config --global user.email "dev2@ntrevo-fitness.local"
```

### Lệnh tạo nhánh hàng tuần chuẩn:
```bash
# Ví dụ Tuần 1:
git checkout develop
git pull origin develop
git checkout -b feat/w1-dev1-discovery-prd   # Dành cho Dev 1
git checkout -b feat/w1-dev2-userstories-ac  # Dành cho Dev 2
```
