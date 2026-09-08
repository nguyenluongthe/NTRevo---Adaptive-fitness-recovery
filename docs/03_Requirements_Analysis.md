# 3.3 Phân tích Yêu cầu: SmartTask AI Hub

## 1. Yêu cầu Chức năng (Functional Requirements - FR)
- **FR01 - AI Breakdown:** Hệ thống cho phép người dùng nhập mô tả công việc thô (prompt), AI sẽ tự động phân tách thành các sub-tasks.
- **FR02 - Quản lý Trạng thái:** Người dùng có thể kéo thả (Drag & Drop) công việc giữa các cột trong Kanban Board (To Do, In Progress, Review, Done).
- **FR03 - PRD Generator:** Cho phép xuất tài liệu Yêu cầu Sản phẩm (PRD) hoàn chỉnh từ các ý tưởng ban đầu bằng AI.
- **FR04 - Cập nhật Tiến độ:** Tự động tính toán % hoàn thành của một Task dựa trên số lượng Sub-tasks đã check.

## 2. Yêu cầu Phi chức năng (Non-Functional Requirements - NFR)
- **NFR01 - Hiệu năng (Performance):** 
  - API phản hồi các thao tác CRUD cơ bản dưới 200ms.
  - API phân tích AI phản hồi dưới 3 giây cho mỗi prompt (hoặc có cơ chế streaming/loading).
- **NFR02 - Khả dụng (Usability):** Giao diện hỗ trợ Dark Mode, áp dụng nguyên tắc Glassmorphism, thân thiện với thiết bị di động (Responsive).
- **NFR03 - Khả năng Mở rộng (Scalability):** Backend thiết kế theo RESTful / Clean Architecture, có thể dễ dàng thay đổi AI Model (OpenAI, Gemini, v.v.) mà không làm vỡ logic.
