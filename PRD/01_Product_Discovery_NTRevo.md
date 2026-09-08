# BÁO CÁO KHÁM PHÁ SẢN PHẨM: NTREVO - ADAPTIVE FITNESS RECOVERY
**Dự án Thực tế:** NTRevo - Nền tảng Phục hồi Thể lực Thích ứng Thông minh bằng AI  
**Phiên bản:** 1.0.0  
**Tác giả:** Đội ngũ Kỹ thuật NTRevo  
**Học phần:** AI trong Kỹ nghệ Phần mềm - Chương 3.1  

---

## 1. Tuyên bố Vấn đề (Problem Statement)
Trong thể thao và thể hình hiện đại, **90% người tập nghiệp dư và bán chuyên nghiệp** thường chỉ tập trung vào cường độ tập luyện (Training Load) mà bỏ qua hoàn toàn giai đoạn **Phục hồi (Recovery)**. Hậu quả thực tế:
- **Hội chứng Quá tải (Overtraining Syndrome):** Dẫn đến suy giảm hệ miễn dịch, mất ngủ, căng thẳng mãn tính và tụt giảm phong độ.
- **Tỷ lệ chấn thương cao:** Rách cơ, viêm gân mạn tính do cơ bắp chưa kịp tái tạo sau các buổi tập nặng.
- **Thiếu sự cá nhân hóa khoa học:** Người tập thường tự phán đoán trạng thái cơ thể một cách cảm tính thay vì dựa trên các chỉ số sinh học thực tế (HRV, RHR, chất lượng giấc ngủ, mức độ đau nhức cơ DOMS).

👉 **Sứ mệnh của NTRevo:** Ứng dụng Trí tuệ Nhân tạo để phân tích đa chiều các chỉ số sinh trắc học và cảm nhận cơ thể, từ đó tự động tính toán **Điểm số Sẵn sàng (Readiness Score)** và đề xuất **Lộ trình Phục hồi Thích ứng (Adaptive Recovery Plan)** theo thời gian thực.

---

## 2. Phân tích Thị trường & Đối thủ Cạnh tranh (Competitive Landscape)

| Tiêu chí so sánh | WHOOP 4.0 | Oura Ring Gen 3 | Garmin Connect | **NTRevo (Sản phẩm của chúng ta)** |
| :--- | :--- | :--- | :--- | :--- |
| **Thiết bị phần cứng** | Bắt buộc mua dây đeo riêng ($30/tháng) | Bắt buộc mua nhẫn ($299+) | Yêu cầu đồng hồ Garmin | **Đa nền tảng (Hỗ trợ nhập tay + Kết nối Apple Health / Google Fit)** |
| **Tính toán Readiness Score** | Có (Strain & Recovery) | Có (Readiness Index) | Có (Body Battery) | **Có (Thuật toán AI phân tích đa chỉ số: HRV + Sleep + DOMS)** |
| **Lộ trình hồi phục thích ứng** | Chỉ hiển thị số liệu tĩnh | Gợi ý nghỉ ngơi cơ bản | Gợi ý giờ nghỉ | **AI chủ động đề xuất bài tập giãn cơ (Mobility/Stretching) & dinh dưỡng cá nhân hóa** |
| **Bản đồ đau mỏi cơ (DOMS Map)** | Không hỗ trợ | Không hỗ trợ | Không hỗ trợ | **Bản đồ cơ bắp trực quan 3D/2D chọn vùng đau mỏi để AI trị liệu thích ứng** |
| **Chi phí tiếp cận** | Rất cao, phí thuê bao đắt | Giá thiết bị đắt đỏ | Thiết bị đắt tiền | **Dễ tiếp cận cho người dùng phổ thông và phòng tập Việt Nam** |

---

## 3. Chân dung Người dùng Mục tiêu (User Personas)

### Persona 1: Người tập Gym / Calisthenics cường độ cao (Nguyễn Tuấn Anh - 24 tuổi)
- **Hành vi:** Tập gym 5-6 buổi/tuần, thường xuyên nâng tạ nặng (Heavy Squat/Deadlift).
- **Nỗi đau:** Hay bị đau nhức cơ bắp kéo dài (DOMS) và mỏi khớp vai nhưng vẫn cố tập, dẫn đến viêm gân và phải nghỉ tập 1 tháng.
- **Kỳ vọng từ NTRevo:** Nhận được cảnh báo khi cơ thể chưa hồi phục đủ, và gợi ý các bài kéo giãn phục hồi khớp vai tức thì sau buổi tập.

### Persona 2: Vận động viên chạy bộ phong trào (Trần Phương Mai - 29 tuổi)
- **Hành vi:** Chuẩn bị tham gia cự ly 21km (Half Marathon), vừa làm việc văn phòng vừa chạy bộ sáng sớm.
- **Nỗi đau:** Thiếu ngủ, nhịp tim nghỉ ngơi tăng cao nhưng không biết hôm nay nên chạy cự ly dài (Long Run) hay chạy nhẹ phục hồi (Recovery Jog).
- **Kỳ vọng:** Buổi sáng chỉ cần mở app xem điểm **Readiness Score**, AI sẽ tự động điều chỉnh giáo án hôm đó phù hợp với thể trạng thực tế.

### Persona 3: Huấn luyện viên thể lực cá nhân (Lê Minh Hoàng - 36 tuổi)
- **Hành vi:** Huấn luyện 15 học viên tại phòng tập.
- **Nỗi đau:** Không thể theo dõi xem học viên về nhà có ngủ đủ và phục hồi tốt không, dẫn đến học viên kiệt sức trong buổi tập tiếp theo.
- **Kỳ vọng:** Bảng Dashboard tổng hợp chỉ số phục hồi của học viên để cá nhân hóa cường độ bài tập cho từng buổi học.

---

## 4. Value Proposition Canvas (Khung Đề xuất Giá trị NTRevo)

```text
       CUSTOMER PROFILE                         VALUE PROPOSITION (NTREVO)
+------------------------------+        +------------------------------+
| GAINS                        |        | GAIN CREATORS                |
| - Tập luyện bền vững, không  |  <---  | - Đề xuất bài tập giãn cơ    |
|   lo chấn thương             |        |   thích ứng theo vùng đau    |
| - Tối đa hóa hiệu suất cơ bắp|        | - Lộ trình dinh dưỡng bổ sung|
| - Ngủ ngon và hồi phục nhanh |        | - Điểm Readiness chuẩn xác   |
+------------------------------+        +------------------------------+
| PAINS                        |        | PAIN RELIEVERS               |
| - Đau mỏi cơ bắp kéo dài     |  <---  | - Cảnh báo nguy cơ quá tải   |
| - Không biết khi nào nên nghỉ|        | - Phân biệt đau cơ tốt vs xấu|
| - Mua thiết bị đeo quá đắt   |        | - Nhập liệu linh hoạt, dễ xài|
+------------------------------+        +------------------------------+
| CUSTOMER JOBS                |        | PRODUCTS & SERVICES          |
| - Theo dõi sức khỏe phục hồi |  <---  | - Nền tảng NTRevo Platform   |
| - Lập kế hoạch tập & nghỉ    |        | - AI Adaptive Recovery Engine|
| - Giãn cơ và chăm sóc cơ thể |        | - Muscle Heatmap & Exercises |
+------------------------------+        +------------------------------+
```

---

## 5. Ma trận SWOT của NTRevo

### Điểm mạnh (Strengths)
- Mô hình phục hồi thích ứng (Adaptive Recovery) đầu tiên kết hợp cả dữ liệu sinh học khách quan (HRV, Sleep) và cảm nhận chủ quan (DOMS Muscle Map).
- Gợi ý hành động can thiệp cụ thể (Active Recovery Exercises) thay vì chỉ đưa ra con số thụ động.
- Giao diện Dark Mode hiện đại, trực quan hóa trạng thái cơ thể rõ ràng.

### Điểm yếu (Weaknesses)
- Cần thời gian tích lũy dữ liệu lịch sử của người dùng (7-14 ngày) để thuật toán AI học đường cơ sở (Baseline) sinh học chính xác nhất.

### Cơ hội (Opportunities)
- Thị trường Fitness & Wellness tại Đông Nam Á đang tăng trưởng vượt bậc sau đại dịch.
- Nhận thức của cộng đồng chạy bộ và gymer về "Recovery Science" (Khoa học phục hồi) ngày càng cao.

### Thách thức (Threats)
- Các tập đoàn công nghệ lớn (Apple, Garmin, Google Fitbit) liên tục cập nhật tính năng sinh trắc học vào hệ sinh thái có sẵn.

---

## 6. Hành trình Trải nghiệm Khách hàng (Customer Journey Map - CJM)

| Giai đoạn | Hành động của Người dùng | Suy nghĩ & Nỗi sợ | Điểm chạm (Touchpoint) | Cơ hội cho NTRevo |
| :--- | :--- | :--- | :--- | :--- |
| **1. Đăng ký & Nhập mục tiêu** | Tạo hồ sơ, chọn môn thể thao (Gym, Running, Crossfit) | "Hệ thống có hiểu đúng cường độ tập của mình không?" | Màn hình Onboarding | Cung cấp bài khảo sát thể lực ban đầu thông minh |
| **2. Ghi nhận chỉ số sáng sớm** | Nhập số giờ ngủ, nhịp tim hoặc đồng bộ tự động | "Mất bao nhiêu thời gian mỗi sáng?" | Quick Log Form | Nhập liệu siêu tốc chỉ trong 30 giây với giao diện kéo trượt (Sliders) |
| **3. Chọn vùng đau mỏi cơ** | Chạm vào các nhóm cơ trên bản đồ cơ thể (Ngực, Đùi, Vai) | "Đùi mình đau buốt sau buổi Leg Day hôm qua" | Muscle Heatmap | Hệ thống tự tính mức độ nghiêm trọng của DOMS |
| **4. Xem AI Đánh giá Readiness** | Bấm xem điểm số phục hồi hôm nay | "Hôm nay mình có thể tập nặng được không?" | Readiness Dial Gauge | AI xuất điểm số trực quan: Xanh (Sẵn sàng 100%), Vàng (Nên tập nhẹ), Đỏ (Cần nghỉ) |
| **5. Nhận Lộ trình Hồi phục** | Xem các bài tập giãn cơ & dinh dưỡng AI đề xuất | "Bài tập kéo giãn này thực hiện như thế nào?" | Adaptive Plan Viewer | Tích hợp hướng dẫn từng bước (Step-by-step) kèm video/ảnh minh họa |
