# THƯ MỤC TÀI LIỆU YÊU CẦU SẢN PHẨM CHUẨN HÓA (PRD & REQUIREMENTS SUITE)
**Học phần:** Kỹ thuật Phần mềm nâng cao / AI trong Phát triển Phần mềm  
**Chương 3:** AI trong Phân tích Yêu cầu & Sản phẩm  
**Dự án:** SmartTask AI Hub  

---

## 📑 Danh mục Tài liệu Chuẩn hóa trong Thư mục `PRD/`

Thư mục này chứa đầy đủ và toàn diện 5 cấu phần phân tích yêu cầu phần mềm chuẩn theo giáo trình:

1. [01_Product_Discovery_Report.md](./01_Product_Discovery_Report.md)
   - **Mục 3.1 Khám phá Sản phẩm (Product Discovery):** Tuyên bố vấn đề, Phân tích thị trường & Đối thủ cạnh tranh, Chân dung người dùng (Personas), Khung đề xuất giá trị (Value Proposition Canvas), Ma trận SWOT, Hành trình trải nghiệm khách hàng (Customer Journey Map), và Bộ Prompt Discovery.

2. [02_Product_Requirements_Document_Full.md](./02_Product_Requirements_Document_Full.md)
   - **Mục 3.2 Tài liệu Yêu cầu Sản phẩm (PRD):** Tầm nhìn sản phẩm, Mục tiêu & Chỉ số thành công (OKRs/KPIs), Phạm vi Trong/Ngoài dự án (Scope In/Out), Bảng yêu cầu chức năng (FR-01 -> FR-07), Bảng yêu cầu phi chức năng (NFR-01 -> NFR-04), Kiến trúc kỹ thuật, Lộ trình 3 Sprint, và Quản trị rủi ro.

3. [03_System_Modeling_and_Diagrams.md](./03_System_Modeling_and_Diagrams.md)
   - **Mục 3.3 Phân tích Yêu cầu & Mô hình hóa Hệ thống:** Sơ đồ Use Case Mermaid, Sơ đồ Tuần tự (Sequence Diagram) cho AI Auto-Breakdown và PRD Generator, Sơ đồ Trạng thái Task (State Machine), Sơ đồ Thực thể Quan hệ Nghiệp vụ (ERD).

4. [04_User_Stories_BDD_Acceptance_Criteria.md](./04_User_Stories_BDD_Acceptance_Criteria.md)
   - **Mục 3.4 User Stories & Tiêu chí Chấp nhận:** Chuẩn hóa INVEST cho từng Story, Danh mục Epics (Kanban UI, AI Auto-Breakdown, AI PRD Generator), Điểm Story Points, Độ ưu tiên, và Kịch bản nghiệm thu kiểm thử hành vi BDD/Gherkin (Happy Path, Edge Cases, Negative Paths).

5. [05_Feature_API_Specifications_and_Contracts.md](./05_Feature_API_Specifications_and_Contracts.md)
   - **Mục 3.5 Đặc tả Tính năng & Hợp đồng API:** Đặc tả chi tiết các RESTful API Endpoints (`/api/v1/ai/breakdown`, `/api/v1/ai/generate-prd`, `/api/v1/tasks/{id}/status`), JSON Request/Response Schemas, Ma trận mã lỗi HTTP (400, 404, 422, 500) và quy tắc xử lý ngoại lệ giao diện.

---

## 👥 Phân công Đóng góp của Nhóm 2 Người:
- **Dev 1:** Phụ trách Tài liệu Discovery, Tổng quan PRD & Màn hình Dashboard Kanban (`index.html`).
- **Dev 2:** Phụ trách Mô hình hóa Mermaid, User Stories BDD Gherkin, Đặc tả API & Màn hình AI Generator (`ai-generator.html`).
