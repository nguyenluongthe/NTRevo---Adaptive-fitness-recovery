# 3.4 User Stories & Tiêu chí Chấp nhận (BDD/Gherkin)

## Epic: Màn hình AI Generator

### User Story 1: Tạo PRD bằng AI
**As a** Product Owner
**I want to** nhập một ý tưởng sản phẩm thô vào form
**So that** AI có thể tự động viết ra bản Yêu cầu Sản phẩm (PRD) chi tiết.

**Acceptance Criteria (Gherkin):**
- **Given** người dùng đang ở màn hình "AI PRD Generator"
- **When** người dùng nhập "App quản lý task cá nhân" và bấm "Sinh PRD"
- **Then** màn hình hiển thị loading xoay vòng
- **And** sau 3 giây hiển thị nội dung Markdown của PRD.

### User Story 2: Tự động phân tách công việc bằng AI
**As a** Project Manager (Người quản lý dự án)
**I want to** sử dụng AI để tự động phân tách một công việc lớn thành các tác vụ nhỏ (sub-tasks)
**So that** tôi không phải nhập tay từng đầu việc một, tiết kiệm thời gian lập kế hoạch.

**Acceptance Criteria (Gherkin format):**
- **Scenario 1: Happy Path - AI bóc tách thành công**
  - **Given** người dùng đang ở trên màn hình Kanban Board
  - **When** người dùng nhấn nút "✨ AI Auto-Breakdown"
  - **Then** hệ thống sẽ tự động thêm các sub-tasks liên quan vào cột To Do.

- **Scenario 2: Edge Case - Lỗi kết nối AI**
  - **Given** người dùng đang sử dụng tính năng "✨ AI Auto-Breakdown"
  - **When** kết nối đến AI API bị lỗi (timeout hoặc 500)
  - **Then** hệ thống phải hiển thị Toast message cảnh báo "Không thể kết nối đến AI, vui lòng thử lại sau"
  - **And** không làm treo (crash) ứng dụng.
