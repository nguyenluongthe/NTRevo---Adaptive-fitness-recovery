# BỘ DANH MỤC USER STORIES & TIÊU CHÍ CHẤP NHẬN (BDD/GHERKIN)
**Dự án:** SmartTask AI Hub  
**Chuẩn áp dụng:** Agile INVEST & Behavior-Driven Development (BDD)  
**Phiên bản:** 1.0.0  

---

## 1. Tiêu chuẩn Đánh giá INVEST cho User Stories
Mọi User Story trong dự án đều phải thỏa mãn 6 tiêu chí:
- **I (Independent):** Độc lập, có thể phát triển và bàn giao mà không bị chặn hoàn toàn bởi story khác.
- **N (Negotiable):** Có thể thương lượng, không cố định cứng nhắc mà có thể điều chỉnh qua thảo luận nhóm.
- **V (Valuable):** Mang lại giá trị hữu hình cho người dùng cuối hoặc quy trình vận hành nhóm.
- **E (Estimable):** Có thể ước lượng được độ phức tạp (theo thang điểm Story Points: 1, 2, 3, 5, 8).
- **S (Small):** Đủ nhỏ để hoàn thành trong tối đa 2-3 ngày làm việc của 1 lập trình viên.
- **T (Testable):** Có thể kiểm thử được thông qua các kịch bản nghiệm thu cụ thể (Given - When - Then).

---

## 2. Danh mục Chi tiết User Stories theo Epics

### EPIC 01: TRỰC QUAN HÓA BẢNG CÔNG VIỆC KANBAN

#### Story 1.1: Hiển thị Bảng Kanban 4 Cột Trạng thái
- **As a** Thành viên nhóm phát triển (Developer/PM)
- **I want to** xem toàn bộ công việc được phân chia theo 4 cột: To Do, In Progress, Review, Done
- **So that** tôi có thể nắm bắt tổng quan tiến độ của dự án trong nháy mắt.
- **Story Points:** 2 | **Độ ưu tiên:** High (P0)

**Tiêu chí chấp nhận (Acceptance Criteria - Gherkin):**
```gherkin
Scenario: Hiển thị đầy đủ các cột trạng thái khi tải trang
  Given Người dùng mở trang web tại địa chỉ "frontend/index.html"
  When Trang web tải hoàn tất
  Then Người dùng nhìn thấy 4 cột: "To Do", "In Progress", "Review", "Done"
  And Mỗi cột có màu nền Dark Mode phân biệt và tiêu đề rõ ràng
  And Các thẻ công việc hiện có nằm đúng trong cột tương ứng.
```

#### Story 1.2: Kéo thả Thẻ Công việc giữa các Cột
- **As a** Lập trình viên đang thực hiện tác vụ
- **I want to** kéo thẻ công việc từ cột "To Do" sang "In Progress" hoặc "Done"
- **So that** tôi cập nhật trạng thái làm việc nhanh chóng mà không cần mở form chỉnh sửa.
- **Story Points:** 3 | **Độ ưu tiên:** High (P0)

**Tiêu chí chấp nhận (Gherkin):**
```gherkin
Scenario: Kéo thả thành công từ To Do sang In Progress (Happy Path)
  Given Thẻ công việc "task1" đang nằm trong cột "To Do"
  When Người dùng nhấn giữ chuột và kéo thẻ "task1" sang vùng cột "In Progress"
  And Thả chuột trong ranh giới cột "In Progress"
  Then Thẻ "task1" chuyển sang hiển thị trong cột "In Progress"
  And Độ trong suốt (opacity) của thẻ trở lại bình thường (1.0).

Scenario: Kéo thả ra ngoài khu vực hợp lệ (Edge Case)
  Given Thẻ công việc "task1" đang nằm trong cột "To Do"
  When Người dùng kéo thẻ "task1" ra ngoài vùng bảng Kanban và thả chuột
  Then Thẻ "task1" vẫn giữ nguyên vị trí trong cột "To Do" ban đầu
  And Không phát sinh lỗi JavaScript trên Console.
```

---

### EPIC 02: TỰ ĐỘNG BÓC TÁCH CÔNG VIỆC BẰNG TRÍ TUỆ NHÂN TẠO (AI BREAKDOWN)

#### Story 2.1: Kích hoạt Sinh Tác vụ Tự động bằng Nút Bấm
- **As a** Quản lý Dự án (Project Manager)
- **I want to** bấm nút "✨ AI Auto-Breakdown" trên thanh điều hướng
- **So that** AI tự động tạo ra một thẻ công việc mẫu có gắn nhãn và mô tả chi tiết vào cột To Do.
- **Story Points:** 3 | **Độ ưu tiên:** High (P0)

**Tiêu chí chấp nhận (Gherkin):**
```gherkin
Scenario: Sinh thẻ công việc thành công (Happy Path)
  Given Người dùng đang ở trên màn hình Kanban Dashboard
  When Người dùng nhấn vào nút "✨ AI Auto-Breakdown"
  Then Một thẻ công việc mới được tạo ra và xuất hiện ngay tại cột "To Do"
  And Thẻ này có tiêu đề "Thiết kế giao diện bằng AI"
  And Thẻ có gắn nhãn "✨ AI Generated" màu tím nổi bật
  And Thẻ mới có thuộc tính draggable=true để có thể kéo thả ngay lập tức.

Scenario: Người dùng bấm liên tục nhiều lần (Edge Case / Stress Test)
  Given Người dùng đang ở trên màn hình Dashboard
  When Người dùng bấm nút "✨ AI Auto-Breakdown" 3 lần liên tiếp
  Then 3 thẻ công việc riêng biệt với mã ID duy nhất (ví dụ: task-1234, task-5678) được tạo lần lượt
  And Thứ tự hiển thị không bị đè lên nhau.
```

---

### EPIC 03: TRÌNH SINH ĐẶC TẢ YÊU CẦU & PRD BẰNG AI (AI PRD GENERATOR)

#### Story 3.1: Nhập Ý tưởng Thô và Sinh PRD Tự động
- **As a** Product Owner (PO)
- **I want to** nhập mô tả ý tưởng tính năng vào ô văn bản tại màn hình `ai-generator.html`
- **So that** hệ thống phân tích và sinh ra tài liệu PRD gồm Epic, User Stories và Yêu cầu NFR.
- **Story Points:** 5 | **Độ ưu tiên:** High (P0)

**Tiêu chí chấp nhận (Gherkin):**
```gherkin
Scenario: Người dùng nhập ý tưởng hợp lệ (Happy Path)
  Given Người dùng đang ở trang "ai-generator.html"
  And Ô nhập văn bản "#promptInput" có nội dung "Tôi muốn làm tính năng đăng nhập bằng Google"
  When Người dùng bấm nút "🚀 Phân tích bằng AI"
  Then Khung hiển thị "#resultArea" hiển thị thông báo "⏳ AI đang phân tích yêu cầu..."
  And Sau 2.5 giây, khung kết quả hiển thị thông báo "✅ Phân tích thành công!"
  And Xuất hiện danh mục các User Stories tương ứng với tính năng đăng nhập.

Scenario: Người dùng bấm nút khi chưa nhập nội dung (Negative Path)
  Given Người dùng đang ở trang "ai-generator.html"
  And Ô nhập văn bản "#promptInput" đang để trống
  When Người dùng bấm nút "🚀 Phân tích bằng AI"
  Then Hệ thống kích hoạt cảnh báo "Vui lòng nhập ý tưởng trước khi phân tích!"
  And Không thực hiện gọi tiến trình phân tích AI.

Scenario: Kiểm tra điều hướng qua lại giữa 2 màn hình (Usability Navigation)
  Given Người dùng đang ở trang "ai-generator.html"
  When Người dùng bấm vào liên kết "Dashboard" trên thanh menu
  Then Trình duyệt chuyển hướng mượt mà về trang "index.html"
  And Trạng thái các cột và thẻ Kanban được giữ nguyên vẹn.
```
