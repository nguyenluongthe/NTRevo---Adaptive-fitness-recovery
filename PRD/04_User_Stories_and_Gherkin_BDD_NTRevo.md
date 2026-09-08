# BỘ USER STORIES & TIÊU CHÍ CHẤP NHẬN BDD/GHERKIN: NTREVO
**Dự án:** NTRevo - Adaptive Fitness & Recovery Platform  
**Chuẩn áp dụng:** Agile INVEST & Behavior-Driven Development (BDD/Gherkin)  
**Chương 3.4:** User Stories & Tiêu chí Chấp nhận  

---

## 1. Tiêu chuẩn INVEST áp dụng cho NTRevo
- **Independent (Độc lập):** Tính năng ghi nhận chỉ số (Logging) có thể hoạt động độc lập với tính năng xem lịch sử.
- **Negotiable (Thương lượng):** Danh mục bài tập phục hồi có thể mở rộng theo phản hồi từ huấn luyện viên.
- **Valuable (Giá trị):** Cung cấp ngay hành động can thiệp (ví dụ: bài tập 10 phút) thay vì chỉ đưa ra con số thụ động.
- **Estimable (Ước lượng):** Mỗi story được gán điểm Story Points rõ ràng (1, 2, 3, 5, 8).
- **Small (Nhỏ gọn):** Hoàn thành trong vòng 1-2 ngày của Sprint.
- **Testable (Kiểm thử được):** 100% kịch bản có tiêu chí chấp nhận định dạng Given - When - Then.

---

## 2. Danh mục Chi tiết User Stories theo Epics

### EPIC 01: GHI NHẬN CHỈ SỐ SINH HỌC & BẢN ĐỒ ĐAU MỎI CƠ (DOMS)

#### Story 1.1: Ghi nhận giấc ngủ và nhịp tim buổi sáng
- **As an** Vận động viên / Người tập gym
- **I want to** nhập nhanh số giờ ngủ và nhịp tim nghỉ ngơi vào mỗi buổi sáng
- **So that** hệ thống có dữ liệu để tính toán mức độ phục hồi của hệ thần kinh giao cảm.
- **Story Points:** 2 | **Độ ưu tiên:** High (P0)

```gherkin
Scenario: Nhập chỉ số thể lực hợp lệ (Happy Path)
  Given Người dùng mở màn hình ghi nhận chỉ số buổi sáng
  When Người dùng kéo thanh trượt giấc ngủ chọn "7.5 giờ"
  And Chọn chất lượng giấc ngủ là "4 sao"
  And Nhập nhịp tim nghỉ ngơi là "56 bpm"
  And Nhấn nút "Lưu chỉ số"
  Then Hệ thống lưu trữ bản ghi thành công
  And Tự động chuyển hướng người dùng sang bước chọn bản đồ cơ bắp.

Scenario: Người dùng nhập giá trị nhịp tim bất thường (Edge Case / Validation)
  Given Người dùng đang ở màn hình ghi nhận chỉ số
  When Người dùng nhập nhịp tim là "220 bpm" hoặc "10 bpm"
  Then Hệ thống hiển thị thông báo lỗi: "Chỉ số nhịp tim không hợp lệ. Vui lòng kiểm tra lại thiết bị đo!"
  And Không cho phép gửi dữ liệu lên máy chủ.
```

#### Story 1.2: Chọn vùng cơ bắp đau mỏi trên bản đồ tương tác
- **As an** Vận động viên vừa hoàn thành bài tập nặng
- **I want to** chạm vào các nhóm cơ bị căng cứng (ví dụ: Cơ đùi trước, Cơ vai) trên bản đồ cơ thể
- **So that** AI biết chính xác cơ nào cần được giãn cơ và trị liệu thích ứng.
- **Story Points:** 3 | **Độ ưu tiên:** High (P0)

```gherkin
Scenario: Chọn nhiều nhóm cơ bị đau nhức
  Given Người dùng đang xem Bản đồ cơ thể tương tác (Interactive Muscle Map)
  When Người dùng click vào vùng "Cơ đùi trước (Quadriceps)" và chọn mức đau "7/10"
  And Click tiếp vào vùng "Cơ vai sau (Rear Deltoid)" và chọn mức đau "5/10"
  Then Cả hai vùng cơ trên mô hình đổi sang màu cam và đỏ tương ứng
  And Hệ thống ghi nhận 2 nhóm cơ mục tiêu cần phục hồi trong ngày.
```

---

### EPIC 02: AI ĐÁNH GIÁ ĐIỂM READINESS & SINH LỘ TRÌNH THÍCH ỨNG

#### Story 2.1: Tính toán Điểm Sẵn sàng (Readiness Score) theo thời gian thực
- **As an** Người tập thể thao
- **I want to** xem điểm số phục hồi tổng quát từ 0 đến 100
- **So that** tôi biết hôm nay cơ thể đã sẵn sàng tập nặng hay chỉ nên tập nhẹ.
- **Story Points:** 5 | **Độ ưu tiên:** High (P0)

```gherkin
Scenario: Điểm phục hồi tối ưu (Optimal Readiness)
  Given Người dùng có giấc ngủ trên 8 giờ, nhịp tim nghỉ ngơi thấp (52 bpm), và không đau cơ
  When Hệ thống AI chạy thuật toán đánh giá
  Then Kết quả trả về điểm số Readiness từ 85 đến 100 (Vùng Xanh Lá)
  And Hiển thị thông điệp: "Cơ thể bạn đang ở trạng thái đỉnh cao! Hoàn hảo cho các bài tập nặng hoặc thi đấu."

Scenario: Điểm phục hồi kém kèm cảnh báo (High Fatigue State)
  Given Người dùng chỉ ngủ 4.5 giờ và báo đau cơ cấp độ 8/10
  When Hệ thống AI chạy thuật toán đánh giá
  Then Kết quả trả về điểm số Readiness dưới 45 (Vùng Đỏ)
  And Hệ thống hiển thị khuyến nghị: "Nguy cơ chấn thương cao! Nên chuyển sang bài tập Active Recovery hoặc nghỉ ngơi hoàn toàn."
```

#### Story 2.2: Đề xuất Bài tập Giãn cơ Thích ứng (Adaptive Mobility Protocol)
- **As an** Người tập bị căng cơ đùi
- **I want to** nhận được một danh sách bài tập giãn cơ và lăn bọt (Foam Rolling) được thiết kế riêng cho vùng đùi
- **So that** tôi có thể tự phục hồi tại nhà trong 15 phút.
- **Story Points:** 5 | **Độ ưu tiên:** High (P0)

```gherkin
Scenario: AI gợi ý bài tập theo đúng nhóm cơ đau mỏi
  Given Người dùng có vùng "Cơ đùi trước" và "Cơ mông" bị đau mỏi
  When AI sinh kế hoạch phục hồi thích ứng
  Then Danh sách trả về bao gồm 3 bài tập:
    | Tên bài tập | Dụng cụ | Thời lượng |
    | Giãn cơ đùi trước nằm nghiêng (Quad Stretch) | Thảm | 60 giây mỗi bên |
    | Lăn bọt giải phóng màng cơ (Foam Roll Quads) | Bọt lăn (Roller) | 2 phút |
    | Tư thế Bồ câu mở khớp háng (Pigeon Pose) | Thảm | 90 giây mỗi bên |
  And Kèm theo lượng nước và điện giải cần bổ sung trong ngày.
```

---

### EPIC 03: HỆ THỐNG CẢNH BÁO QUÁ TẢI (OVERTRAINING RISK PREVENTION)

#### Story 3.1: Cảnh báo chuỗi suy giảm thể lực liên tiếp
- **As a** Huấn luyện viên thể lực
- **I want to** nhận được cảnh báo tự động khi học viên có điểm Readiness dưới 40 trong 2 ngày liên tiếp
- **So that** tôi can thiệp điều chỉnh giảm ngay giáo án tập luyện của học viên.
- **Story Points:** 3 | **Độ ưu tiên:** Medium (P1)

```gherkin
Scenario: Kích hoạt cảnh báo quá tải đỏ (Critical Fatigue Alert)
  Given Học viên A có điểm Readiness ngày hôm qua là 38 điểm
  And Điểm số Readiness hôm nay của học viên A tiếp tục đạt 35 điểm
  When Hệ thống quét dữ liệu phân tích sáng sớm
  Then Một thông báo đẩy (Push Notification) khẩn cấp được gửi đến học viên và HLV
  And Trạng thái hồ sơ của học viên chuyển sang nhãn: "⚠️ CẢNH BÁO NGUY CƠ CHẤN THƯƠNG".
```
