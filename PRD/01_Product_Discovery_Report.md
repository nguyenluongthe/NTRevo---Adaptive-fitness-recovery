# BÁO CÁO KHÁM PHÁ SẢN PHẨM (PRODUCT DISCOVERY REPORT)
**Dự án:** SmartTask AI Hub  
**Phiên bản:** 1.0.0  
**Tác giả:** Nhóm Phát triển SmartTask AI  
**Ngày lập:** 2026-09-08  

---

## 1. Tuyên bố Vấn đề (Problem Statement)
Trong quy trình phát triển phần mềm hiện đại (Agile/Scrum), các đội ngũ công nghệ thường gặp các vấn đề nghiêm trọng:
- **Tốn thời gian lập kế hoạch:** Product Owner và Project Manager mất trung bình từ 6 - 12 giờ mỗi Sprint chỉ để bóc tách ý tưởng nghiệp vụ thành User Stories và Sub-tasks kỹ thuật.
- **Yêu cầu không đồng nhất & mơ hồ:** Thiếu vắng tiêu chuẩn nghiệm thu rõ ràng (Acceptance Criteria), dẫn đến hiểu nhầm giữa PO, Developer và QA.
- **Thiếu sót đầu việc:** Khi bóc tách thủ công, các yêu cầu phi chức năng (NFR), ca kiểm thử biên (Edge Cases), và các phụ thuộc kỹ thuật (Dependencies) thường bị bỏ quên.

**Mục tiêu của SmartTask AI Hub:** Tận dụng Generative AI để tự động hóa quy trình phân tích yêu cầu từ prompt thô thành tài liệu PRD, sơ đồ kiến trúc, và thẻ công việc Kanban có cấu trúc, giúp rút ngắn 60% thời gian lên kế hoạch Sprint.

---

## 2. Phân tích Thị trường & Đối thủ Cạnh tranh (Competitive Benchmark)

| Tiêu chí so sánh | Trello / Asana | Jira Software | Linear App | **SmartTask AI Hub** |
| :--- | :--- | :--- | :--- | :--- |
| **Quản lý Task trực quan** | Tốt (Kanban cơ bản) | Rất mạnh nhưng phức tạp | Cực tốt, tối giản | Trực quan, Dark Mode Glassmorphism |
| **Tự động bóc tách Task bằng AI** | Chưa hỗ trợ sâu | Cần cài Plugin trả phí | Gợi ý mô tả đơn giản | **Tự động bóc tách thành Sub-tasks & Checklist** |
| **Sinh PRD từ Prompt thô** | Không hỗ trợ | Không hỗ trợ | Không hỗ trợ | **Hỗ trợ sinh PRD chuẩn 5 phần theo thời gian thực** |
| **Sinh kịch bản Gherkin BDD** | Thủ công | Thủ công qua Jira Xray | Thủ công | **Tự động sinh Given-When-Then cho từng User Story** |
| **Chi phí triển khai** | Miễn phí - Trả phí | Đắt đỏ cho nhóm nhỏ | Trả phí theo user | **Mã nguồn mở, dễ dàng tự lưu trữ (Self-hosted)** |

---

## 3. Chân dung Người dùng Mục tiêu (User Personas)

### Persona 1: Product Owner / Project Manager (Alex Nguyen - 32 tuổi)
- **Vai trò:** Quản trị sản phẩm cho nhóm 8 lập trình viên.
- **Nỗi đau (Pain points):**
  - Mất quá nhiều thời gian viết tài liệu PRD dài và gõ từng task con vào bảng công việc.
  - Thường bị lập trình viên hỏi lại vì User Story viết quá ngắn hoặc thiếu tiêu chí nghiệm thu.
- **Kỳ vọng:** Nhập nhanh ý tưởng tính năng, hệ thống tự động sinh ra User Stories chuẩn INVEST và gợi ý sẵn danh mục công việc cần làm.

### Persona 2: Full-stack Developer (Minh Tran - 26 tuổi)
- **Vai trò:** Lập trình viên chính của hệ thống.
- **Nỗi đau:**
  - Nhận các task chung chung như "Làm tính năng đăng nhập" mà không có thông tin chi tiết về API format, mã lỗi hay kịch bản ngoại lệ.
- **Kỳ vọng:** Xem được ngay danh sách Sub-tasks kỹ thuật, yêu cầu NFR về hiệu năng, và định dạng JSON mẫu ngay trên thẻ Kanban.

### Persona 3: QA / Test Engineer (Lan Le - 28 tuổi)
- **Vai trò:** Đảm bảo chất lượng phần mềm.
- **Nỗi đau:**
  - Không có tiêu chí chấp nhận cụ thể để viết test case, phải tự suy đoán hành vi của hệ thống.
- **Kỳ vọng:** Có sẵn các kịch bản kiểm thử theo định dạng Gherkin (Given-When-Then) cho cả ca bình thường (Happy Path) và ca lỗi (Edge Cases).

---

## 4. Value Proposition Canvas (Khung Đề xuất Giá trị)

```text
       CUSTOMER PROFILE                         VALUE PROPOSITION
+------------------------------+        +------------------------------+
| GAINS                        |        | GAIN CREATORS                |
| - Lập kế hoạch nhanh chóng   |  <---  | - Sinh PRD & Story tức thì   |
| - Yêu cầu chuẩn chỉnh, rõ    |        | - Tự sinh checklist kỹ thuật |
| - Tiến độ theo dõi realtime  |        | - Bảng Kanban trực quan kéo  |
+------------------------------+        +------------------------------+
| PAINS                        |        | PAIN RELIEVERS               |
| - Viết tài liệu nhàm chán    |  <---  | - AI tự động viết PRD        |
| - Bỏ sót Edge Cases & NFR    |        | - Tự động đề xuất BDD Gherkin|
| - Đồng bộ hóa thông tin kém  |        | - Trạng thái đồng bộ tự động |
+------------------------------+        +------------------------------+
| CUSTOMER JOBS                |        | PRODUCTS & SERVICES          |
| - Lên kế hoạch Sprint        |  <---  | - SmartTask AI Hub           |
| - Viết tài liệu nghiệp vụ    |        | - AI Prompt Requirements     |
| - Phân công công việc nhóm   |        |   Engine                     |
+------------------------------+        +------------------------------+
```

---

## 5. Ma trận SWOT của Sản phẩm

### Điểm mạnh (Strengths)
- Tích hợp sâu giữa tư duy Quản lý Dự án (Agile/Kanban) và Trí tuệ nhân tạo (AI Engine).
- Giao diện thân thiện, hiện đại, tối ưu cho lập trình viên và quản lý.
- Bộ tài liệu chuẩn hóa từ đầu: PRD, User Story BDD, Kiến trúc API.

### Điểm yếu (Weaknesses)
- Phụ thuộc vào chất lượng sinh phản hồi của mô hình ngôn ngữ lớn (LLM).
- Cần thời gian huấn luyện người dùng nhập prompt đúng cấu trúc để ra kết quả tối ưu.

### Cơ hội (Opportunities)
- Xu hướng tích hợp AI vào Software Engineering (AIOps, AI-assisted development) đang bùng nổ.
- Các doanh nghiệp vừa và nhỏ (SMEs) rất cần công cụ tối ưu chi phí quản lý dự án.

### Thách thức (Threats)
- Các công cụ lớn như Jira, ClickUp đang nhanh chóng bổ sung tính năng AI tích hợp sẵn.

---

## 6. Hành trình Trải nghiệm Khách hàng (Customer Journey Map - CJM)

| Giai đoạn | Hành động của Người dùng | Suy nghĩ & Nỗi sợ | Điểm tiếp xúc (Touchpoint) | Cơ hội cho SmartTask AI Hub |
| :--- | :--- | :--- | :--- | :--- |
| **1. Khởi tạo ý tưởng** | Nhập ý tưởng sơ bộ vào hệ thống | "Liệu ý tưởng này có đủ chi tiết để làm không?" | Màn hình `ai-generator.html` | Cung cấp các gợi ý Prompt thông minh (Prompt Presets) |
| **2. Phân tích AI** | Bấm nút "Phân tích bằng AI" | "Mong là không phải đợi quá lâu hoặc sinh nội dung vô nghĩa" | Loading spinner & Status toast | Hiển thị tiến trình phân tích trực quan, phản hồi < 3s |
| **3. Xem & Chỉnh sửa PRD**| Đọc tài liệu PRD và User Stories | "Cần bổ sung thêm một số quy định bảo mật riêng" | Markdown Viewer / Editor | Cho phép xuất file Markdown hoặc lưu thẳng vào kho docs |
| **4. Đưa vào Kanban** | Bấm nút chuyển thành các Task thẻ | "Các đầu việc con có hợp lý để dev làm ngay không?" | Bảng Kanban `index.html` | Tự động tạo thẻ task với đầy đủ tags, sub-tasks và độ ưu tiên |
| **5. Theo dõi thực thi** | Kéo thả chuyển trạng thái công việc | "Ai đang làm việc gì, tiến độ ra sao?" | Cột To Do / In Progress / Done | Kéo thả mượt mà, tự động cập nhật tiến độ |

---

## 7. Mẫu Prompts Đã Được Kiểm Định Cho Discovery
Dưới đây là cấu trúc prompt hệ thống được sử dụng để trích xuất thông tin:
```text
Role: Chuyên gia Phân tích Nghiệp vụ Phần mềm (Senior Business Analyst).
Task: Hãy phân tích ý tưởng sản phẩm sau: "[Ý TƯỞNG]".
Output Yêu cầu:
1. Chân dung người dùng (User Personas) chính và các rào cản tâm lý.
2. Danh mục 3 tính năng cốt lõi (MVP Features) kèm lý do lựa chọn.
3. Các rủi ro tiềm ẩn về kỹ thuật và phương án dự phòng.
4. Trả kết quả dưới dạng Markdown có bảng biểu chuẩn hóa.
```
