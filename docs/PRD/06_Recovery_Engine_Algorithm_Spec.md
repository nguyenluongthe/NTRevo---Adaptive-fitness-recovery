# 🧠 ĐẶC TẢ THUẬT TOÁN AI RECOVERY ENGINE & CÔNG THỨC FITNESS SCORE
## Phân hệ: AI Core Services - NTRevo Platform
**Tác giả:** Dev 1 (`Dev1-BackendLead`)  
**Tài liệu tham chiếu:** FR-004, FR-010, NFR-P02  
**Trạng thái:** Verified & Ready for Implementation  

---

## 1. MỤC TIÊU & TỔNG QUAN THUẬT TOÁN

Hệ thống AI Recovery Engine có nhiệm vụ chuyển đổi các chuỗi dữ liệu sinh trắc học đa biến (Multivariate Biometric Time-series) và cảm nhận chủ quan của người dùng thành hai chỉ số định lượng:
1. **FitnessScore™ ($FS \in [0, 100]$):** Đánh giá nền tảng thể lực tổng quát dài hạn.
2. **Readiness Score ($RS \in [0, 100]$):** Đánh giá mức độ sẵn sàng vận động trong ngày của hệ thần kinh thực vật và cơ bắp.

---

## 2. CÔNG THỨC TOÁN HỌC & TRỌNG SỐ

### 2.1 Chuẩn hóa dữ liệu đầu vào (Input Normalization)

Mỗi chỉ số đầu vào được đưa về thang đo chuẩn $[0, 100]$:

1. **Độ biến thiên nhịp tim HRV ($HRV_{norm}$):**
   Đo bằng rMSSD (Root Mean Square of Successive Differences).
   - $HRV_{baseline}$: Trung bình trượt 14 ngày của người dùng.
   - Công thức chuẩn hóa:
     $$HRV_{norm} = \min\left(100, \max\left(0, 50 + \frac{HRV_{today} - HRV_{baseline}}{\sigma_{HRV}} \times 20\right)\right)$$

2. **Chỉ số Giấc ngủ ($Sleep_{norm}$):**
   Kết hợp thời lượng thực tế ($T_{sleep}$) và tỷ lệ giấc ngủ sâu ($Deep_{ratio} = \frac{T_{deep}}{T_{sleep}}$):
   $$Sleep_{norm} = \min\left(100, \left(\frac{T_{sleep}}{8.0} \times 70\right) + \left(\frac{Deep_{ratio}}{0.20} \times 30\right)\right)$$

3. **Chỉ số Gắng sức buổi trước ($RPE_{norm}$):**
   Dựa trên thang đo RPE Borg CR10 ($1 \le RPE \le 10$):
   $$RPE_{norm} = \max(0, 100 - (RPE_{prev} - 1) \times 11.11)$$

4. **Chỉ số Đau mỏi cơ bắp ($DOMS_{norm}$):**
   Dựa trên thang điểm đau nhức chủ quan ($1 \le DOMS \le 10$):
   $$DOMS_{norm} = \max(0, 100 - (DOMS - 1) \times 11.11)$$

---

### 2.2 Công thức tổng hợp Readiness Score ($RS$)

Áp dụng mô hình hồi quy đa biến có trọng số thích ứng:

$$RS = w_{hrv} \cdot HRV_{norm} + w_{sleep} \cdot Sleep_{norm} + w_{rpe} \cdot RPE_{norm} + w_{doms} \cdot DOMS_{norm}$$

**Bộ trọng số mặc định:**
* $w_{hrv} = 0.40$ (40% - Phản ánh trực tiếp hệ thần kinh đối giao cảm Parasympathetic Tone)
* $w_{sleep} = 0.30$ (30% - Quá trình tái tạo tế bào và tổng hợp protein cơ bắp)
* $w_{rpe} = 0.15$ (15% - Tải lượng mệt mỏi tích lũy từ phiên tập gần nhất)
* $w_{doms} = 0.15$ (15% - Tổn thương cơ học vi mô Microtrauma)

Tổng trọng số: $\sum w = 1.00$.

---

## 3. BẢNG PHÂN LOẠI TRẠNG THÁI & QUY TẮC ĐIỀU CHỈNH THÍCH NGHI (ADAPTIVE RULES)

| Khoảng Readiness Score | Phân loại ngày tập (Session Classification) | Hệ số Khối lượng (Volume Multiplier) | Hệ số Cường độ (Intensity Multiplier) | Hành động của Hệ thống |
| :---: | :---: | :---: | :---: | :--- |
| **$80 \le RS \le 100$** | **Optimal / Full Session** | $1.00 - 1.10$ | $1.00$ (Theo lịch) | Cho phép tăng tải tiến bộ (Overload), thêm 1-2 sets hoặc tăng 2.5% tạ |
| **$60 \le RS < 80$** | **Modified Intensity** | $0.85$ | $0.90$ (Giảm RPE 1-2 điểm) | Giữ nguyên bài tập chính, cắt giảm bài tập phụ trợ (Accessories) |
| **$40 \le RS < 60$** | **Active Recovery** | $0.50$ | $0.60$ | Chuyển đổi sang đi bộ nhanh, Cardio vùng 2 (Zone 2) hoặc Foam rolling |
| **$0 \le RS < 40$** | **Complete Rest** | $0.00$ | $0.00$ | Khóa buổi tập nặng, hướng dẫn bài tập thở sâu (Box Breathing) và phục hồi dinh dưỡng |

---

## 4. BẢO VỆ CHỐNG KIỆT SỨC (OVERTRAINING OVERRIDE PROTOCOL)

Nếu phát hiện một trong hai điều kiện bất thường sau:
1. $HRV_{today} < HRV_{baseline} - 2.5 \cdot \sigma_{HRV}$ (HRV tụt sốc).
2. $DOMS \ge 9$ ở nhóm cơ chính chuẩn bị tập luyện.

$\Rightarrow$ Hệ thống kích hoạt **Hard Override**, tự động gán trạng thái **Complete Rest** hoặc **Active Recovery**, bất kể các chỉ số khác cao hay thấp, nhằm đảm bảo an toàn tuyệt đối theo tiêu chuẩn y học thể thao.
