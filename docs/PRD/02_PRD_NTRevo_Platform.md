# TÀI LIỆU YÊU CẦU SẢN PHẨM: NTREVO - ADAPTIVE FITNESS RECOVERY
**Mã tài liệu:** PRD-NTREVO-RECOVERY-V1  
**Trạng thái:** Official Specification  
**Thuộc dự án:** NTRevo - Adaptive Fitness & Recovery Platform  
**Phân quyền truy cập:** Toàn bộ Nhóm Phát triển, QA, Huấn luyện viên thể lực  

---

## 1. Tầm nhìn Sản phẩm (Product Vision) & Mục tiêu
NTRevo hướng tới việc trở thành trợ lý phục hồi thể lực cá nhân hóa thông minh hàng đầu, giúp người tập thể thao và vận động viên hiểu sâu sắc về tiếng nói của cơ thể. Bằng cách kết hợp khoa học thể thao (Sports Science) và Trí tuệ nhân tạo (AI), NTRevo biến các chỉ số sinh học phức tạp thành các hành động phục hồi cụ thể, giúp người dùng đạt đỉnh cao phong độ mà không bị kiệt sức hay chấn thương.

### Các Chỉ số Thành công Cốt lõi (OKRs & KPIs)
1. **Giảm thiểu chấn thương do quá tải:** Đạt mục tiêu giảm ít nhất 35% tần suất chấn thương cơ bắp cho nhóm người dùng tuân thủ khuyến nghị hồi phục.
2. **Độ chính xác của điểm số Readiness:** $\ge 88\%$ người dùng phản hồi rằng điểm số Readiness do AI tính toán phản ánh chính xác cảm giác thể lực thực tế của họ trong ngày.
3. **Tỷ lệ hoàn thành bài tập hồi phục (Completion Rate):** Đạt trên 70% người dùng thực hiện các bài kéo giãn cơ (Mobility/Stretching) được AI gợi ý.
4. **Thời gian xử lý của AI:** Đưa ra lộ trình phục hồi thích ứng trong vòng dưới 2.0 giây.

---

## 2. Phạm vi Sản phẩm (Scope Definition)

### 2.1 Trong phạm vi (In-Scope - MVP Release)
- **Dashboard Theo dõi Thể lực:** Hiển thị điểm số Readiness Score (0 - 100), phân cấp theo 3 vùng màu (Xanh: Tối ưu, Vàng: Thận trọng, Đỏ: Cần nghỉ ngơi).
- **Trình ghi nhận chỉ số sinh học (Biometrics Input):** Giờ ngủ, chất lượng giấc ngủ (1-5 sao), nhịp tim nghỉ ngơi (RHR), mức độ đau mỏi cơ (DOMS).
- **Bản đồ cơ bắp đau nhức trực quan (Interactive Muscle Map):** Cho phép chọn vùng cơ đang căng mỏi (Ngực, Lưng, Vai, Đùi trước, Bắp chuối...).
- **Công cụ sinh Lộ trình Phục hồi Thích ứng (AI Adaptive Recovery Generator):** Sinh tự động các bài tập giãn cơ, hướng dẫn lăn bọt (Foam Rolling), tắm tương phản (Contrast Shower) và thực đơn dinh dưỡng bù điện giải.
- **Hệ thống Cảnh báo Quá tải (Overtraining Warning System):** Tự động phát chuông cảnh báo đỏ khi phát hiện chuỗi ngày phục hồi kém.

### 2.2 Ngoài phạm vi (Out-of-Scope - Các giai đoạn sau)
- Chẩn đoán y khoa chuyên khoa cơ xương khớp (Hệ thống chỉ mang tính hỗ trợ hồi phục thể thao, không thay thế bác sĩ y khoa).
- Bán lẻ thực phẩm bổ sung trực tiếp trên app.

---

## 3. Bảng Yêu cầu Chức năng (Functional Requirements - FR)

| Mã FR | Tên chức năng | Mô tả chi tiết hành vi hệ thống | Mức ưu tiên | Tác nhân |
| :--- | :--- | :--- | :--- | :--- |
| **FR-01** | **Ghi nhận Dữ liệu Thể lực Buổi sáng** | Cho phép người dùng nhập hoặc đồng bộ các chỉ số: Số giờ ngủ, chất lượng ngủ, mức độ căng thẳng (Stress Level). | High (P0) | Athlete / User |
| **FR-02** | **Bản đồ Vùng Đau Mỏi Cơ (DOMS)** | Giao diện cho phép người dùng click chọn nhóm cơ bị đau sau buổi tập và đánh giá mức độ đau từ 1 đến 10. | High (P0) | Athlete / User |
| **FR-03** | **Thuật toán Tính điểm Readiness** | AI Engine kết hợp dữ liệu sinh học và mức độ DOMS để tính điểm Readiness Score từ 0 đến 100 theo thời gian thực. | High (P0) | AI Engine |
| **FR-04** | **Sinh Kế hoạch Hồi phục Thích ứng** | Dựa trên điểm Readiness và các vùng cơ đau mỏi, AI tự động tạo ra lộ trình hồi phục cá nhân hóa gồm: Thời gian kéo giãn, bài tập Mobility, dinh dưỡng phục hồi. | High (P0) | AI Engine |
| **FR-05** | **Cảnh báo Nguy cơ Chấn thương** | Nếu điểm Readiness $< 40$ trong 2 ngày liên tiếp, hệ thống gửi thông báo cảnh báo khẩn cấp yêu cầu giảm 50% khối lượng tạ/cự ly chạy. | High (P0) | Notification |
| **FR-06** | **Trực quan hóa Lịch sử Phục hồi** | Biểu đồ đường hiển thị xu hướng biến thiên của Readiness Score, giấc ngủ và tải trọng tập luyện theo tuần/tháng. | Medium (P1) | Athlete / Coach |
| **FR-07** | **Xuất Báo cáo Thể lực cho HLV** | Cho phép xuất báo cáo PDF/Markdown tóm tắt tình trạng hồi phục tuần để chia sẻ với Huấn luyện viên cá nhân. | Low (P2) | Coach / User |

---

## 4. Bảng Yêu cầu Phi chức năng (Non-Functional Requirements - NFR)

### NFR-01: Hiệu năng & Độ phản hồi (Performance SLA)
- **Tốc độ tải Dashboard:** $\le 1.0$ giây.
- **Thời gian phản hồi tính toán AI:** Đưa ra kết quả phân tích Readiness Score và phác thảo bài tập hồi phục trong $\le 1.8$ giây.
- **Khả năng chịu tải:** Hệ thống Backend có khả năng xử lý đồng thời 1,000 requests/giây vào khung giờ cao điểm buổi sáng (6:00 - 8:00 AM).

### NFR-02: Bảo mật & Quyền riêng tư Y tế (Health Data Privacy)
- Toàn bộ dữ liệu sinh trắc học cá nhân (chỉ số tim mạch, cân nặng, giấc ngủ) phải được mã hóa khi lưu trữ (AES-256) và khi truyền tải (TLS 1.3).
- Tuân thủ quy định bảo vệ dữ liệu sức khỏe (tương thích nguyên tắc GDPR & HIPAA).

### NFR-03: Tính Khả dụng & Thiết kế (Usability & Design)
- Giao diện Dark Mode chuyên nghiệp theo phong cách Thể thao Đẳng cấp (Athletic Performance Aesthetic), màu nhấn Xanh lục Neon (`#22c55e`), Đỏ Cảnh báo (`#ef4444`), và Tím Phục hồi (`#a855f7`).
- Đạt độ tương phản tối thiểu 4.5:1 (Chuẩn WCAG 2.1 AA).

---

## 5. Kiến trúc Hệ thống NTRevo

```text
[ Thiết bị Đeo / Người dùng ]
            │
            ▼ (Nhập liệu buổi sáng / Đồng bộ chỉ số)
[ NTRevo Client Dashboard (HTML5 / Vanilla CSS / Modern JS) ]
            │
            ▼ RESTful API (HTTPS / JSON)
[ FastAPI Recovery Gateway ]
    ├── Authentication & Rate Limiting
    ├── Biometrics Ingestion Controller
    └── [ NTRevo AI Adaptive Engine ]
            ├── Module 1: Readiness Score Machine Learning Model
            ├── Module 2: DOMS Muscle Stress Analyzer
            └── Module 3: Recovery Protocol Generator (LLM + Rules Engine)
            │
            ▼
[ Cơ sở Dữ liệu PostgreSQL & Cache Redis ]
```

---

## 6. Lộ trình Triển khai 3 Sprint
- **Sprint 1 (Tuần 1):** Phân tích Yêu cầu, PRD, Bảng điều khiển Readiness Dashboard & Mô phỏng AI Recovery Generator.
- **Sprint 2 (Tuần 2):** Xây dựng Bản đồ cơ bắp tương tác (Interactive Muscle Map) và Sơ đồ luồng thể lực thích ứng.
- **Sprint 3 (Tuần 3):** Hoàn thiện Backend API, Tích hợp thuật toán tính điểm và Kiểm thử tự động NFR.
