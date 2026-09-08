# KẾ HOẠCH HÀNG TUẦN & PHÂN CÔNG NHÓM 2 NGƯỜI (CHƯƠNG 3 → CHƯƠNG 9)
**Môn học:** Ứng dụng Trí tuệ Nhân tạo trong Kỹ nghệ Phần mềm  
**Dự án:** NTRevo - Adaptive Fitness & Recovery Platform  
**Mục tiêu:** Đạt điểm tuyệt đối theo các tiêu chí quét tự động của Model/Bot Git (Authorship, Branches, Commits, PR Review chéo 50/50)  

---

## 👥 1. THÔNG TIN THÀNH VIÊN VÀ PHÂN VAI TRÒ
| Thành viên | Tên cấu hình Git (Gợi ý) | Vai trò chính trong dự án | Trách nhiệm chính |
| :--- | :--- | :--- | :--- |
| **Thành viên 1 (Dev 1)** | `Dev1-BackendLead` | Backend Lead & AI Core Architecture | Thiết kế CSDL, Backend API, Thuật toán AI Recovery Engine, Unit Testing & NFR Hardening |
| **Thành viên 2 (Dev 2)** | `Dev2-FrontendQA` | Frontend Lead & QA/BA Specialist | Thiết kế UI/UX Dashboard, Trực quan hóa dữ liệu sinh trắc học, User Stories Gherkin, E2E Testing |

---

## 🌿 2. QUY ƯỚC NHÁNH GIT VÀ QUY TRÌNH REVIEW CHÉO (GITFLOW)
- **Nhánh chính:**
  - `main`: Chỉ chứa các bản phát hành ổn định sau mỗi tuần.
  - `develop`: Nhánh tích hợp chung mã nguồn của cả hai thành viên.
- **Quy tắc tạo nhánh hàng tuần:**
  - Dev 1: `feat/w<so_tuan>-dev1-<ten_tinh_nang>`
  - Dev 2: `feat/w<so_tuan>-dev2-<ten_tinh_nang>`
- **Quy trình Review chéo (Peer Review):**
  - Mỗi thành viên push từ nhánh của mình lên GitHub, tạo Pull Request vào `develop`.
  - Thành viên còn lại vào PR nhận xét (ít nhất 1-2 comment mang tính chuyên môn) và bấm **Approve**.
  - Merge PR vào `develop` và đồng bộ vào `main`.

---

## 📅 3. LỘ TRÌNH 7 TUẦN CHI TIẾT (TỪ CHƯƠNG 3 ĐẾN CHƯƠNG 9)

### 📍 Tuần 1: Chương 3 - AI trong Phân tích Yêu cầu & Sản phẩm
- **Dev 1 (`feat/w1-dev1-discovery-prd`):** Khám phá sản phẩm (3.1), Tài liệu PRD tổng thể (3.2), Đặc tả API Hồi phục (3.5), Dựng khung giao diện Dashboard.
- **Dev 2 (`feat/w1-dev2-userstories-ac`):** Phân tích Yêu cầu chức năng/phi chức năng (3.3), Danh mục User Stories chuẩn INVEST & BDD Gherkin (3.4), Dựng màn hình AI Recovery Generator.
- **Bàn giao:** Thư mục `docs/`, `PRD/`, giao diện web tương tác `index.html` và `ai-generator.html`.

### 📍 Tuần 2: Chương 4 - AI trong Thiết kế Sản phẩm
- **Dev 1 (`feat/w2-dev1-ai-wireframe`):** Dùng AI sinh cấu trúc Component Wireframe (JSON layout), thiết kế bản mẫu Prototype cho trang đo chỉ số thể lực.
- **Dev 2 (`feat/w2-dev2-userflow-review`):** Dùng AI sinh sơ đồ luồng người dùng (Mermaid User Flow), Module AI Design Review đánh giá độ tương phản màu sắc & WCAG 2.1.
- **Bàn giao:** Sơ đồ User Flow, Báo cáo AI Design Review và trang xem Wireframe động.

### 📍 Tuần 3: Chương 5 - AI trong Thiết kế & Kiến trúc Phần mềm
- **Dev 1 (`feat/w3-dev1-architecture-db`):** Thiết kế kiến trúc Clean Architecture, dùng AI sinh Schema CSDL quan hệ chuẩn 3NF (PostgreSQL/SQLite) và sơ đồ Mermaid ERD.
- **Dev 2 (`feat/w3-dev2-uml-api-patterns`):** Dùng AI sinh sơ đồ UML Sequence & Class Diagram, tài liệu hợp đồng API OpenAPI 3.0 (Swagger YAML).
- **Bàn giao:** File `schema.sql`, sơ đồ ERD trực quan, file đặc tả `openapi_spec.yaml`.

### 📍 Tuần 4: Chương 6 - AI Lập trình (Code Generation & Completion)
- **Dev 1 (`feat/w4-dev1-codegen-backend`):** Dùng AI sinh mã nguồn thuật toán tính điểm phục hồi (Readiness Score) và bộ nhớ đệm Caching.
- **Dev 2 (`feat/w4-dev2-codegen-frontend`):** Dùng AI sinh mã nguồn Frontend State Management, biểu đồ nhịp tim HRV và API Interceptors.
- **Bàn giao:** Module AI Core Service hoàn chỉnh, nhật ký đối thoại AI Pair Programming.

### 📍 Tuần 5: Chương 7 - Tái cấu trúc & Review Mã nguồn cùng AI
- **Dev 1 (`feat/w5-dev1-refactor-smells`):** Sử dụng AI phát hiện Code Smells, tái cấu trúc mã nguồn theo nguyên lý SOLID.
- **Dev 2 (`feat/w5-dev2-ai-code-review-bot`):** Viết Script/Bot `ai_code_reviewer.py` tự động nhận xét và chấm điểm Pull Request trên GitHub Actions.
- **Bàn giao:** Báo cáo Refactoring, Script Bot AI Review hoạt động tự động.

### 📍 Tuần 6: Chương 8 - AI trong Kiểm thử Phần mềm
- **Dev 1 (`feat/w6-dev1-ai-unit-integration`):** Dùng AI sinh 100% Test Cases Pytest (Unit Test & Integration Test), đo lường Coverage $\ge 85\%$.
- **Dev 2 (`feat/w6-dev2-ai-e2e-automation`):** Dùng AI sinh kịch bản E2E Test tự động, lập ma trận truy vết kiểm thử (Traceability Matrix) liên kết User Stories.
- **Bàn giao:** Báo cáo kiểm thử tự động, bảng Traceability Matrix.

### 📍 Tuần 7: Chương 9 - AI trong Sinh Tài liệu Kỹ thuật & Bàn giao
- **Dev 1 (`feat/w7-dev1-tech-docs-adr`):** Dùng AI sinh tài liệu Quyết định Kiến trúc (ADR), Deployment Runbook, hoàn thiện API Docs.
- **Dev 2 (`feat/w7-dev2-onboarding-guide`):** Dùng AI sinh tài liệu Hướng dẫn lập trình viên mới (Developer Onboarding Guide) & Kịch bản Slide bảo vệ.
- **Bàn giao:** Toàn bộ kho tài liệu hoàn chỉnh, Tag bản phát hành `v1.0.0` trên `main`.

---

## 📊 4. BẢNG THEO DÕI TỶ LỆ ĐÓNG GÓP (50% - 50%)
Mỗi tuần đảm bảo mỗi thành viên có từ **3 đến 6 commits nhỏ**, có tiêu đề rõ ràng theo Conventional Commits (`feat:`, `docs:`, `test:`, `refactor:`) để bot ghi nhận đóng góp cân bằng tuyệt đối.
