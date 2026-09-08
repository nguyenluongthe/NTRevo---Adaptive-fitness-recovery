# THƯ MỤC TÀI LIỆU YÊU CẦU SẢN PHẨM: DỰ ÁN THẬT NTREVO (ADAPTIVE FITNESS RECOVERY)
**Tên dự án:** NTRevo - Adaptive Fitness & Recovery Platform  
**Kho lưu trữ GitHub:** [nguyenluongthe/NTRevo---Adaptive-fitness-recovery](https://github.com/nguyenluongthe/NTRevo---Adaptive-fitness-recovery)  
**Môn học:** Ứng dụng Trí tuệ Nhân tạo trong Kỹ nghệ Phần mềm  
**Chương 3:** AI trong Phân tích Yêu cầu & Sản phẩm  

---

## 🎯 Giới thiệu Dự án NTRevo
**NTRevo (Adaptive Fitness Recovery)** là nền tảng trí tuệ nhân tạo chuyên sâu phục vụ việc theo dõi, phân tích và đề xuất lộ trình **Hồi phục Thể lực Thích ứng (Adaptive Recovery)** dành cho vận động viên, người tập gym và chạy bộ. Hệ thống kết hợp giữa các chỉ số sinh học khách quan (Giấc ngủ, Nhịp tim nghỉ ngơi RHR, Độ biến thiên nhịp tim HRV) và cảm nhận đau nhức cơ bắp chủ quan (DOMS Muscle Soreness) để tối ưu hóa hiệu suất và phòng ngừa chấn thương do quá tải.

---

## 📑 Danh mục Tài liệu Đặc tả Nghiệp vụ Chi tiết trong Thư mục `PRD/`:

1. [01_Product_Discovery_NTRevo.md](./01_Product_Discovery_NTRevo.md)
   - **Mục 3.1 Khám phá Sản phẩm (Product Discovery):** Phân tích vấn đề hội chứng quá tải (Overtraining syndrome), so sánh đối thủ (Whoop, Oura, Garmin), 3 chân dung người dùng (Gymer Tuấn Anh, Runner Phương Mai, Coach Hoàng), Khung đề xuất giá trị (Value Proposition Canvas), Ma trận SWOT, và Bản đồ hành trình khách hàng (Customer Journey Map).

2. [02_PRD_NTRevo_Platform.md](./02_PRD_NTRevo_Platform.md)
   - **Mục 3.2 Tài liệu PRD Toàn diện:** Tầm nhìn sản phẩm, Mục tiêu & OKRs (giảm 35% chấn thương, độ chính xác Readiness $\ge 88\%$), Phạm vi Scope In/Out, 7 Yêu cầu chức năng (FR-01 $\rightarrow$ FR-07), 3 Yêu cầu phi chức năng (NFR về SLA $\le 1.8$s, bảo mật y tế HIPAA), Kiến trúc hệ thống và Kế hoạch 3 Sprint.

3. [03_Requirements_Analysis_and_Architecture_NTRevo.md](./03_Requirements_Analysis_and_Architecture_NTRevo.md)
   - **Mục 3.3 Phân tích & Mô hình hóa Hệ thống:** Sơ đồ Use Case Mermaid tương tác giữa Vận động viên, Huấn luyện viên và AI Engine; Sơ đồ Tuần tự (Sequence Diagram) luồng đánh giá Readiness buổi sáng; Sơ đồ Vòng đời Thể lực (State Machine); và Sơ đồ Thực thể Quan hệ CSDL (ERD).

4. [04_User_Stories_and_Gherkin_BDD_NTRevo.md](./04_User_Stories_and_Gherkin_BDD_NTRevo.md)
   - **Mục 3.4 User Stories & Tiêu chí Chấp nhận BDD/Gherkin:** Đánh giá chuẩn INVEST, 3 Epics chính (Ghi nhận chỉ số & Bản đồ DOMS, AI Tính điểm Readiness & Bài tập thích ứng, Cảnh báo quá tải), Story Points, Kịch bản Given-When-Then cho Happy Path, Edge Cases và trường hợp nhịp tim bất thường.

5. [05_API_Specifications_NTRevo.md](./05_API_Specifications_NTRevo.md)
   - **Mục 3.5 Đặc tả Tính năng & Hợp đồng API:** Đặc tả RESTful API chi tiết (`POST /api/v1/recovery/biometrics`, `POST /api/v1/recovery/evaluate`, `GET /api/v1/recovery/trends`), Schemas JSON Request/Response, Mã lỗi HTTP (400, 401, 422, 503) và cơ chế Fallback Heuristic.

---

## 👥 Phân chia Trách nhiệm & Nhánh Git theo chuẩn Giảng viên:
- **Thành viên 1 (Dev 1):** Phụ trách Discovery, PRD Core, API Specifications & Thiết kế Backend/AI Logic.
- **Thành viên 2 (Dev 2):** Phụ trách Phân tích Yêu cầu, Sơ đồ Mermaid, User Stories Gherkin & Thiết kế Giao diện Thể lực.
- **Quy chuẩn Git:** Đảm bảo mỗi tuần có 2 nhánh độc lập, Pull Request review chéo và đóng góp tỷ lệ 50% - 50%.
