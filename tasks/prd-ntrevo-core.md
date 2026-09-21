# PRD: NTRevo - Nền Tảng Phục Hồi Thể Lực Thích Ứng (Adaptive Fitness Recovery MVP)

## 1. Introduction / Giới thiệu
NTRevo là nền tảng theo dõi và tối ưu hóa quá trình hồi phục thể lực cá nhân hóa dành cho vận động viên và người tập thể thao. Thay vì phỏng đoán tình trạng quá tải, NTRevo thu thập các chỉ số sinh học buổi sáng (nhịp tim nghỉ RHR, giấc ngủ, stress, bản đồ đau mỏi cơ DOMS) và sử dụng AI Engine để tính toán **Điểm Sẵn Sàng (Readiness Score: 0-100)** cùng **Lộ trình phục hồi thích ứng (Adaptive Recovery Protocol)**, kèm hệ thống cảnh báo sớm nguy cơ quá tải (Overtraining).

Tài liệu này đặc tả toàn bộ 7 yêu cầu chức năng cốt lõi (FR-01 đến FR-07) cho phiên bản MVP.

---

## 2. Goals / Mục tiêu
- Cung cấp giao diện check-in buổi sáng nhanh chóng (< 60 giây) để ghi nhận chỉ số sinh học và nhóm cơ đau nhức.
- Tính toán điểm Readiness tức thì (< 1.5 giây) theo trọng số chuẩn y sinh học thể thao.
- Tự động gợi ý các bài tập phục hồi (giãn cơ, foam rolling, dinh dưỡng bù khoáng) tương ứng chính xác với nhóm cơ bị đau mỏi.
- Cảnh báo chủ động nguy cơ quá tải/chấn thương khi chuỗi hồi phục rơi vào vùng nguy hiểm (Readiness < 40 trong 2 ngày liên tiếp).
- Trực quan hóa xu hướng phục hồi theo tuần và cho phép xuất báo cáo chia sẻ với HLV cá nhân.

---

## 3. User Stories / Câu chuyện Người dùng

### US-001: Data Models & Storage for Biometrics and Recovery Logs
**Description:** As a developer, I need database models and storage schema for athletes' morning biometrics, DOMS logs, and AI readiness scores so that data persists reliably across sessions.

**Acceptance Criteria:**
- [ ] Define data models for `BiometricsLog` (sleep_hours, sleep_quality, rhr_bpm, stress_level, recorded_at)
- [ ] Define data models for `DomsLog` (muscle_group, pain_level 1-10)
- [ ] Define data models for `ReadinessResult` (readiness_score, recovery_zone, recommendations)
- [ ] Typecheck passes

### US-002: Morning Biometrics Check-in Form (FR-01)
**Description:** As an athlete, I want to quickly log my morning sleep hours, sleep quality, resting heart rate, and stress level so the system can evaluate my nervous system recovery.

**Acceptance Criteria:**
- [ ] Input sliders/controls for: Sleep hours (0-14h), Sleep quality (1-5 stars), Resting heart rate (RHR: 30-150 bpm), Stress level (1-5)
- [ ] Client-side validation prevents invalid or out-of-range biometric values
- [ ] Submit button saves biometric record and triggers next step
- [ ] Typecheck passes
- [ ] Verify in browser

### US-003: Interactive Muscle Soreness (DOMS) Map (FR-02)
**Description:** As an athlete with sore muscles, I want an interactive body map to select specific muscle groups and rate pain intensity (1-10) so the AI knows where to focus recovery.

**Acceptance Criteria:**
- [ ] Interactive SVG/Visual body map with selectable muscle zones: Chest, Upper Back, Lower Back, Shoulders, Quads, Hamstrings, Calves
- [ ] Clicking a muscle group opens a pain severity scale (1 to 10)
- [ ] Sore muscles are visually highlighted with color gradient (yellow for mild, orange for moderate, crimson for severe)
- [ ] Typecheck passes
- [ ] Verify in browser

### US-004: AI Readiness Score Engine Calculation (FR-03)
**Description:** As an athlete, I want the system to calculate my Readiness Score (0-100) instantly with weighted biometrics and DOMS so I know whether to train hard or rest.

**Acceptance Criteria:**
- [ ] Readiness engine computes score using formula: HRV/RHR ($15\%$), Sleep ($30\%$), Stress ($20\%$), DOMS penalty ($35\%$)
- [ ] Output categorizes into 3 zones: Optimal (80-100, Green), Caution (50-79, Yellow), Rest/Danger (< 50, Red)
- [ ] Calculation executes and displays in under 500ms
- [ ] Typecheck passes
- [ ] Tests pass

### US-005: Adaptive Recovery Protocol Generator (FR-04)
**Description:** As a user with localized muscle fatigue, I want AI to generate targeted mobility exercises, foam rolling instructions, and hydration tips based on my sore muscles.

**Acceptance Criteria:**
- [ ] Generates specific 10-15 minute recovery plan targeting selected DOMS muscle groups
- [ ] Each exercise specifies duration (seconds/minutes), equipment needed (mat, foam roller), and instructions
- [ ] Includes hydration and electrolyte recommendations based on fatigue score
- [ ] Typecheck passes
- [ ] Verify in browser

### US-006: Early Overtraining Warning System (FR-05)
**Description:** As an athlete and coach, I want an immediate warning alert when Readiness is below 40 for two consecutive days so I can prevent injury.

**Acceptance Criteria:**
- [ ] System checks historical records for consecutive low readiness scores (< 40)
- [ ] Displays prominent emergency warning badge: "⚠️ CẢNH BÁO NGUY CƠ CHẤN THƯƠNG / OVERTRAINING RISK"
- [ ] Automatically recommends reducing training intensity by 50% or full rest day
- [ ] Typecheck passes
- [ ] Verify in browser

### US-007: Recovery Trends & Biometrics Visualization (FR-06)
**Description:** As an athlete, I want to view trend charts of my readiness score, sleep duration, and resting heart rate over the past 7 to 30 days.

**Acceptance Criteria:**
- [ ] Interactive chart displaying 7-day and 30-day Readiness trend
- [ ] Multi-metric overlay showing correlation between sleep hours and readiness score
- [ ] Responsive design for mobile and desktop screens
- [ ] Typecheck passes
- [ ] Verify in browser

### US-008: Coach Summary & Weekly Report Export (FR-07)
**Description:** As an athlete, I want to export my weekly recovery summary to Markdown or printable PDF format so I can review it with my personal coach.

**Acceptance Criteria:**
- [ ] "Export Report" button generates formatted weekly report
- [ ] Report includes average readiness, peak fatigue days, primary sore muscles, and training recommendations
- [ ] Support printing or direct Markdown download
- [ ] Typecheck passes
- [ ] Verify in browser

---

## 4. Functional Requirements / Yêu cầu Chức năng
- **FR-01: Morning Biometrics Check-in**: Form nhập giờ ngủ (0.5h bước nhảy), đánh giá sao giấc ngủ (1-5), nhịp tim nghỉ ngơi RHR (bpm) và mức độ căng thẳng.
- **FR-02: Interactive DOMS Muscle Map**: Bản đồ cơ thể trực quan tương tác cho phép chọn các vùng cơ bị đau mỏi và gán thang đo 1-10.
- **FR-03: AI Readiness Score Engine**: Thuật toán tính điểm 0-100 theo thời gian thực phân bổ 3 vùng màu (Xanh, Vàng, Đỏ).
- **FR-04: Adaptive Recovery Protocol**: Hệ thống tự động đề xuất lộ trình phục hồi thích ứng theo cơ mục tiêu (bài tập kéo giãn, lăn bọt, dinh dưỡng).
- **FR-05: Overtraining Early Warning**: Cảnh báo chủ động khi chỉ số Readiness rơi xuống dưới 40 trong 2 ngày liên tiếp.
- **FR-06: Recovery Trends Visualization**: Biểu đồ trực quan hóa dữ liệu theo dõi 7 ngày và 30 ngày.
- **FR-07: Coach Report Export**: Xuất báo cáo thể lực tuần định dạng Markdown/PDF để trao đổi với HLV.

---

## 5. Non-Goals / Ngoài phạm vi MVP
- Không thực hiện chẩn đoán y khoa chuyên sâu hoặc kê đơn thuốc giảm đau.
- Không kết nối Bluetooth trực tiếp với phần cứng vòng đeo tay trong giai đoạn MVP (nhập số liệu qua giao diện).
- Không tích hợp thanh toán hoặc bán thực phẩm bổ sung.

---

## 6. Design & Athletic Aesthetics / Thiết kế Giao diện
- **Giao diện Athletic Dark Mode**: Nền tối thể thao cao cấp (`#0f172a`, `#1e293b`), viền neon tinh tế.
- **Màu sắc trạng thái chuẩn y sinh**:
  - Tối ưu (Optimal): Xanh Neon `#22c55e`
  - Thận trọng (Caution): Vàng Hổ Phách `#f59e0b`
  - Cảnh báo (Danger): Đỏ Thể Thao `#ef4444`
  - Phục hồi (Recovery): Tím Thể Thao `#8b5cf6`
- **Micro-animations**: Hiệu ứng chuyển động mượt mà khi chọn nhóm cơ và render vòng tròn điểm số.

---

## 7. Technical Considerations / Kỹ thuật & Kiến trúc
- Frontend: HTML5, CSS3 hiện đại (CSS Variables, Flexbox, Grid), Vanilla JavaScript (ES6+ modular).
- Kiến trúc module hóa sạch: `biometrics.js`, `doms-map.js`, `readiness-engine.js`, `recovery-protocol.js`, `trends.js`.
- Lưu trữ cục bộ: `localStorage` cho MVP offline-first, sẵn sàng đồng bộ RESTful API backend.

---

## 8. Success Metrics / Chỉ số Đo lường
- Thời gian hoàn tất Morning Check-in < 60 giây.
- Thời gian tính toán và hiển thị Readiness + Gợi ý < 500ms.
- 100% User Stories vượt qua Typecheck và Verify in browser.
