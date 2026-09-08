# 3.5 Đặc tả Tính năng (Feature Specification)

## 1. Tính năng AI Auto-Breakdown
- **Mô tả:** Tự động chia nhỏ công việc.
- **Trigger:** Nhấn nút "✨ AI Auto-Breakdown" trên giao diện Kanban Board.
- **Luồng dữ liệu:** Frontend -> API Backend -> AI Engine -> Trả về danh sách Task -> Cập nhật State Frontend.
- **API Endpoint dự kiến:** `POST /api/v1/ai/breakdown`
  - **Request Body:** `{ "prompt": "Tên công việc chính..." }`
  - **Response:** `{ "status": "success", "tasks": [ { "id": "...", "title": "...", "tags": [...] } ] }`

## 2. Tính năng Sinh PRD (PRD Generator)
- **Mô tả:** Người dùng nhập mô tả chức năng, hệ thống trả về PRD theo form chuẩn.
- **Trigger:** Nút "Phân tích bằng AI" trên màn hình AI Generator.
- **Luồng dữ liệu:** Prompt Input -> AI Service -> Markdown Output.
- **Xử lý giao diện:** Hiển thị trạng thái "Đang phân tích..." với timeout (hoặc websocket stream) để tránh block UI.
