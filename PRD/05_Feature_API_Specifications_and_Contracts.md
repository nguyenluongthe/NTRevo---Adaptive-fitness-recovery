# ĐẶC TẢ TÍNH NĂNG VÀ HỢP ĐỒNG GIAO TIẾP API (FEATURE & API SPECIFICATIONS)
**Dự án:** SmartTask AI Hub  
**Chuẩn thiết kế:** RESTful API Specification (OpenAPI 3.0 Compatible)  
**Phiên bản:** 1.0.0  

---

## 1. Tổng quan Kiến trúc API
Các giao diện Frontend tương tác với Backend/AI Engine thông qua giao thức HTTP/HTTPS với định dạng dữ liệu chuẩn `application/json`.

---

## 2. Đặc tả Chi tiết các Endpoints

### 2.1 API Phân tách Tác vụ Tự động (AI Task Breakdown)
- **Endpoint:** `/api/v1/ai/breakdown`
- **Method:** `POST`
- **Mô tả:** Nhận vào một chuỗi mô tả công việc thô, AI Engine sẽ phân tích ngữ nghĩa và trả về danh sách các đầu việc con có cấu trúc.

#### Request Headers:
```http
Content-Type: application/json
Authorization: Bearer <API_TOKEN> (Optional in Dev mode)
```

#### Request Body Schema:
```json
{
  "title": "Thiết kế giao diện bằng AI",
  "context": "Xây dựng khung giao diện Kanban và trang công cụ AI PRD cho bài thực hành Chương 3",
  "max_subtasks": 5
}
```

#### Response Success (`200 OK`):
```json
{
  "status": "success",
  "timestamp": "2026-09-08T10:40:00Z",
  "data": {
    "task_id": "task-8821",
    "title": "Thiết kế giao diện bằng AI",
    "status": "todo",
    "priority": "P1",
    "tags": ["AI Generated", "UI/UX", "Sprint1"],
    "subtasks": [
      {
        "id": "sub-01",
        "title": "Tạo layout 4 cột cho Kanban Board",
        "completed": false
      },
      {
        "id": "sub-02",
        "title": "Tích hợp thư viện HTML5 Drag & Drop",
        "completed": false
      },
      {
        "id": "sub-03",
        "title": "Tạo màn hình công cụ nhập Prompt AI Generator",
        "completed": false
      }
    ]
  }
}
```

---

### 2.2 API Sinh Tài liệu PRD từ Ý tưởng (AI PRD Generation)
- **Endpoint:** `/api/v1/ai/generate-prd`
- **Method:** `POST`
- **Mô tả:** Nhận ý tưởng bài toán hoặc tính năng thô, sinh ra tài liệu PRD hoàn chỉnh định dạng Markdown.

#### Request Body Schema:
```json
{
  "prompt": "Tôi muốn xây dựng tính năng đăng nhập bảo mật hỗ trợ xác thực 2 lớp qua Google Authenticator",
  "target_audience": "Developers & QA",
  "output_format": "markdown"
}
```

#### Response Success (`200 OK`):
```json
{
  "status": "success",
  "data": {
    "epic_name": "Two-Factor Authentication (2FA)",
    "markdown_content": "### Epic: Two-Factor Authentication\n**Story:** As a user, I want to scan a QR code...",
    "estimated_story_points": 8,
    "suggested_technologies": ["TOTP Algorithm", "PyOTP Library", "QR Code Generator"]
  }
}
```

---

### 2.3 API Cập nhật Trạng thái Kéo thả Thẻ Task (Task State Transition)
- **Endpoint:** `/api/v1/tasks/{task_id}/status`
- **Method:** `PATCH`
- **Mô tả:** Cập nhật cột trạng thái hiện tại của thẻ task sau khi người dùng kéo thả.

#### Path Parameter:
- `task_id` (string, required): Mã định danh duy nhất của task (Ví dụ: `task-8821`).

#### Request Body Schema:
```json
{
  "new_status": "in_progress",
  "previous_status": "todo",
  "updated_by": "user_dev1"
}
```

#### Response Success (`200 OK`):
```json
{
  "status": "success",
  "message": "Trạng thái thẻ task đã được cập nhật sang 'in_progress'.",
  "updated_at": "2026-09-08T10:40:15Z"
}
```

---

## 3. Ma trận Mã lỗi và Xử lý Ngoại lệ (Error Handling Matrix)

| HTTP Status Code | Mã Lỗi (Error Code) | Tình huống phát sinh | Cách xử lý trên Frontend |
| :--- | :--- | :--- | :--- |
| **400 Bad Request** | `EMPTY_PROMPT` | Người dùng bấm gửi khi prompt rỗng hoặc chỉ có khoảng trắng. | Hiển thị thông báo Alert/Toast yêu cầu nhập nội dung. |
| **404 Not Found** | `TASK_NOT_FOUND` | ID thẻ task được kéo thả không tồn tại trong cơ sở dữ liệu. | Trả thẻ task về cột ban đầu và thông báo lỗi. |
| **422 Unprocessable** | `INVALID_STATUS_TRANSITION` | Kéo thả vi phạm quy tắc trạng thái (ví dụ: nhảy từ `Draft` sang `Done`). | Hủy thao tác kéo thả, giữ nguyên vị trí thẻ. |
| **500 Server Error** | `AI_SERVICE_UNAVAILABLE` | Dịch vụ AI Engine gặp sự cố mạng hoặc quá tải request. | Hiển thị Toast màu đỏ: "AI tạm thời không phản hồi, vui lòng thử lại sau". |
