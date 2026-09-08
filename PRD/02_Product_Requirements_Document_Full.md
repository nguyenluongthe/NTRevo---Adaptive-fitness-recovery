# TÀI LIỆU YÊU CẦU SẢN PHẨM TOÀN DIỆN (FULL PRODUCT REQUIREMENTS DOCUMENT)
**Tên dự án:** SmartTask AI Hub  
**Mã dự án:** PRD-SMARTTASK-2026  
**Trạng thái:** Approved  
**Đối tượng sử dụng:** Product Team, Development Team, QA Team, Stakeholders  

---

## 1. Tầm nhìn Sản phẩm (Product Vision) & Mục tiêu
SmartTask AI Hub hướng tới trở thành nền tảng quản lý công việc và phát triển phần mềm thông minh thế hệ mới, nơi việc chuyển hóa từ **ý tưởng kinh doanh** sang **kế hoạch kỹ thuật thực thi** được tự động hóa bằng AI chỉ trong vài giây, giảm thiểu tối đa sai số và sự mơ hồ trong giao tiếp giữa các thành viên.

### Các Chỉ số Thành công Cốt lõi (Success Metrics / KPIs)
1. **Thời gian lên kế hoạch Sprint:** Giảm từ 8 giờ xuống dưới 2 giờ cho mỗi chu kỳ Sprint 2 tuần.
2. **Độ chi tiết của Task (Task Completeness Rate):** 100% các thẻ công việc được sinh ra đều có ít nhất 3 Sub-tasks và Tiêu chí chấp nhận (Gherkin AC).
3. **Tỷ lệ áp dụng:** Đạt trên 85% phản hồi tích cực từ lập trình viên về mức độ rõ ràng của yêu cầu công việc.

---

## 2. Phạm vi Sản phẩm (Scope Definition)

### 2.1 Trong phạm vi (In-Scope - MVP Release)
- Màn hình Bảng Kanban tương tác: Hỗ trợ 4 cột trạng thái (To Do, In Progress, Review, Done).
- Cơ chế kéo thả thẻ công việc (HTML5 Drag and Drop API) mượt mà.
- Công cụ **AI PRD & Story Generator**: Nhập prompt mô tả nghiệp vụ thô, sinh tự động bản đặc tả và User Stories.
- Công cụ **AI Auto-Breakdown**: Tự động phân tách công việc lớn thành các thẻ công việc nhỏ gắn trực tiếp vào bảng Kanban.
- Bộ tài liệu đặc tả kỹ thuật và tiêu chuẩn nghiệm thu BDD/Gherkin chuẩn hóa.

### 2.2 Ngoài phạm vi (Out-of-Scope - Phiên bản tương lai)
- Tích hợp thanh toán trực tuyến hoặc gói thành viên SaaS.
- Đăng nhập SSO thông qua Active Directory doanh nghiệp (sẽ làm trong Sprint 5).
- Ứng dụng di động native trên iOS/Android (giai đoạn hiện tại tập trung Responsive Web).

---

## 3. Danh mục Yêu cầu Chức năng (Functional Requirements - FR)

| Mã FR | Tên chức năng | Mô tả chi tiết | Mức độ ưu tiên | Tác nhân |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | **Hiển thị Bảng Kanban** | Giao diện hiển thị các cột trạng thái phân chia rõ ràng, hỗ trợ Dark Mode và thẻ công việc nổi bật. | High (P0) | All Users |
| **FR-02** | **Kéo thả Cập nhật Trạng thái** | Cho phép người dùng kéo thả thẻ task từ cột này sang cột khác, hệ thống tự động cập nhật vị trí và trạng thái. | High (P0) | All Users |
| **FR-03** | **Sinh Sub-tasks bằng AI** | Nhấn nút "✨ AI Auto-Breakdown" để gọi thuật toán phân tách công việc thô thành các nhiệm vụ con kèm tag nhận diện. | High (P0) | PM / Dev |
| **FR-04** | **Trình tạo PRD & User Stories** | Cho phép người dùng nhập mô tả dự án tại màn hình `ai-generator.html`, hệ thống sinh ra tài liệu PRD định dạng Markdown. | High (P0) | PO / BA |
| **FR-05** | **Gán nhãn & Phân loại Task** | Mỗi thẻ công việc có các tag nhận diện: `AI Generated`, `Docs`, `UI/UX`, `Backend`, `Testing`. | Medium (P1) | Dev / QA |
| **FR-06** | **Chỉ số Tiến độ Công việc** | Hiển thị tỷ lệ hoàn thành (%) dựa trên số lượng Sub-tasks đã hoàn tất trong từng thẻ task. | Medium (P1) | All Users |
| **FR-07** | **Xuất Báo cáo Tài liệu** | Khả năng copy hoặc xuất bản tài liệu PRD đã tạo ra định dạng `.md` để lưu trữ trong kho mã nguồn. | Low (P2) | PO / PM |

---

## 4. Danh mục Yêu cầu Phi chức năng (Non-Functional Requirements - NFR)

### NFR-01: Hiệu năng (Performance & Latency)
- **Tốc độ tải trang đầu tiên (FCP):** $\le 1.2$ giây trên mạng băng thông rộng thông thường.
- **Độ trễ phản hồi thao tác UI:** Kéo thả thẻ task phản hồi thị giác tức thì ($\le 50$ms).
- **Thời gian xử lý AI (AI Latency):** Phản hồi kết quả sinh PRD/Sub-tasks không vượt quá 3.0 giây. Nếu vượt quá, phải hiển thị thanh tiến trình trực quan.

### NFR-02: Tính Khả dụng & Trải nghiệm (Usability & Accessibility)
- Áp dụng nguyên tắc thiết kế **Dark Mode Glassmorphism** hiện đại, độ tương phản màu sắc đạt chuẩn **WCAG 2.1 Level AA**.
- Thân thiện với các kích thước màn hình phổ biến từ Desktop (1920x1080, 1440x900) đến Laptop (1366x768).

### NFR-03: Tính Ổn định & Khả năng Chịu lỗi (Reliability & Fault Tolerance)
- Khi mô phỏng hoặc kết nối AI gặp sự cố (timeout/500), hệ thống không được crash toàn bộ giao diện; phải hiển thị thông báo lỗi rõ ràng và cho phép thử lại.
- Dữ liệu kéo thả trên client không bị biến mất bất thường trong phiên làm việc.

### NFR-04: Khả năng Mở rộng & Bảo trì (Maintainability & Extensibility)
- Mã nguồn phân tách rõ ràng: Cấu trúc thư mục chuẩn tách biệt `docs/`, `PRD/`, `frontend/css/`, `frontend/js/`.
- Tuân thủ quy chuẩn Gitflow với các nhánh tính năng `feat/...` độc lập cho từng thành viên.

---

## 5. Kiến trúc Công nghệ Đề xuất (Technical Stack)

```text
[ Người dùng / Trình duyệt ]
          │
          ▼
[ Giao diện Frontend ]
  - HTML5 Semantics & Drag-Drop API
  - Modern CSS (Custom Properties, Flexbox, Glassmorphism Dark Mode)
  - Vanilla ES6 JavaScript (Tách biệt modules, xử lý Async/Await)
          │
          ▼
[ Tầng Xử lý Nghiệp vụ & AI Engine ]
  - Prompt Engineering Rules
  - Requirements Parser & Task Decomposer (JSON Output)
  - RESTful API Contracts
```

---

## 6. Lộ trình Triển khai (Release Roadmap - 3 Sprints)

| Sprint | Thời lượng | Trọng tâm công việc | Kết quả bàn giao (Deliverables) |
| :--- | :--- | :--- | :--- |
| **Sprint 1 (Tuần 1)** | 1 Tuần | Phân tích Yêu cầu, Soạn thảo PRD, Thiết lập Base UI Kanban & AI Screen. | Thư mục `docs/`, `PRD/`, 2 màn hình `index.html` và `ai-generator.html`. |
| **Sprint 2 (Tuần 2)** | 1 Tuần | Thiết kế luồng User Flow, Wireframing & Mô hình dữ liệu Task. | Sơ đồ Mermaid đầy đủ, Modal chỉnh sửa Task chi tiết. |
| **Sprint 3 (Tuần 3)** | 1 Tuần | Tích hợp Backend API, Kiểm thử NFR tự động & Tối ưu hiệu năng. | Bộ API endpoints CRUD Task, Test Suite kiểm thử BDD. |

---

## 7. Rủi ro & Chiến lược Giảm thiểu (Risks & Mitigation)

| Rủi ro | Tác động | Xác suất | Giải pháp Giảm thiểu |
| :--- | :--- | :--- | :--- |
| **Chất lượng nội dung AI không ổn định** | Cao | Trung bình | Thiết lập khung Prompt khuôn mẫu nghiêm ngặt (Strict Schema Validation) và cho phép người dùng chỉnh sửa tay. |
| **Xung đột mã nguồn khi làm việc nhóm** | Trung bình | Cao | Phân chia nhánh Git độc lập (`feat/s1-kanban-dashboard` và `feat/s1-ai-generator-screen`), review chéo qua PR. |
| **Độ trễ mạng khi gọi AI API** | Trung bình | Trung bình | Thiết kế giao diện bất đồng bộ với Skeleton Loading và thông báo trạng thái rõ ràng. |
