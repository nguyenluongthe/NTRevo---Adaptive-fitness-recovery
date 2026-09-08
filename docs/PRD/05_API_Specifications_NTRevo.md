# ĐẶC TẢ GIAO DIỆN LẬP TRÌNH ỨNG DỤNG (API SPECIFICATIONS): NTREVO
**Dự án:** NTRevo - Adaptive Fitness Recovery Platform  
**Chuẩn thiết kế:** RESTful OpenAPI 3.0 Standard  
**Chương 3.5:** Đặc tả Tính năng & Hợp đồng API  

---

## 1. Tổng quan Kiến trúc Dịch vụ API
Toàn bộ các yêu cầu được gửi tới máy chủ FastAPI thông qua HTTPS với payload dạng JSON. Cơ chế xác thực sử dụng JSON Web Token (JWT) trong header `Authorization: Bearer <token>`.

---

## 2. Danh mục Chi tiết các Endpoints

### 2.1 API Ghi nhận Chỉ số Sinh học Buổi sáng (Ingest Biometrics)
- **Endpoint:** `/api/v1/recovery/biometrics`
- **Method:** `POST`
- **Mô tả:** Lưu trữ dữ liệu về giấc ngủ, nhịp tim nghỉ ngơi và mức độ stress buổi sáng của người dùng.

#### Request Headers:
```http
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

#### Request Body Schema:
```json
{
  "user_id": "usr_99812",
  "record_date": "2026-09-08",
  "sleep_hours": 7.5,
  "sleep_quality_rating": 4,
  "resting_heart_rate": 56,
  "heart_rate_variability_hrv": 68.4,
  "perceived_stress_level": 3,
  "sore_muscles": [
    {
      "muscle_group": "Quadriceps",
      "soreness_intensity": 7
    },
    {
      "muscle_group": "Hamstrings",
      "soreness_intensity": 5
    }
  ]
}
```

#### Response Success (`201 Created`):
```json
{
  "status": "success",
  "message": "Chỉ số thể lực đã được ghi nhận thành công.",
  "data": {
    "log_id": "log_rec_20260908_01",
    "created_at": "2026-09-08T06:30:15Z"
  }
}
```

---

### 2.2 API Đánh giá Thể lực & Đề xuất Lộ trình Thích ứng (Evaluate Readiness & Adaptive Plan)
- **Endpoint:** `/api/v1/recovery/evaluate`
- **Method:** `POST`
- **Mô tả:** Kích hoạt thuật toán AI tính toán Readiness Score và đề xuất các bài tập kéo giãn, dinh dưỡng thích ứng.

#### Request Body Schema:
```json
{
  "log_id": "log_rec_20260908_01",
  "intensity_preference": "adaptive",
  "available_time_minutes": 20
}
```

#### Response Success (`200 OK`):
```json
{
  "status": "success",
  "timestamp": "2026-09-08T06:30:17Z",
  "data": {
    "readiness_score": 64,
    "state_category": "Caution",
    "color_code": "#eab308",
    "insights": "Cơ bắp vùng đùi có dấu hiệu viêm nhẹ sau buổi tập chân. Hệ thần kinh giao cảm ổn định nhưng cần ưu tiên giãn cơ trước khi vận động nặng.",
    "training_advice": "Hôm nay nên giảm 30% mức tạ hoặc thay buổi chạy biến tốc bằng chạy nhẹ hồi phục (Zone 2).",
    "adaptive_protocol": {
      "total_duration_minutes": 18,
      "hydration_recommendation_ml": 2500,
      "mobility_exercises": [
        {
          "id": "ex_01",
          "name": "Giãn cơ tứ đầu đùi (Kneeling Quad Stretch)",
          "target_muscle": "Quadriceps",
          "duration": "60 giây mỗi bên",
          "reps": 2,
          "video_url": "https://cdn.ntrevo.fit/videos/quad_stretch.mp4"
        },
        {
          "id": "ex_02",
          "name": "Lăn bọt giải phóng màng cơ đùi (Foam Rolling)",
          "target_muscle": "Quadriceps & IT Band",
          "duration": "90 giây",
          "reps": 1,
          "video_url": "https://cdn.ntrevo.fit/videos/foam_rolling.mp4"
        }
      ]
    },
    "overtraining_risk": {
      "is_critical": false,
      "consecutive_low_days": 1
    }
  }
}
```

---

### 2.3 API Truy vấn Lịch sử Xu hướng Phục hồi Tuần (Recovery Trends)
- **Endpoint:** `/api/v1/recovery/trends`
- **Method:** `GET`
- **Query Parameters:**
  - `start_date` (string, optional): `YYYY-MM-DD`
  - `end_date` (string, optional): `YYYY-MM-DD`

#### Response Success (`200 OK`):
```json
{
  "status": "success",
  "data": {
    "average_readiness": 74.2,
    "weekly_trend": [
      { "date": "2026-09-02", "score": 85, "status": "Optimal" },
      { "date": "2026-09-03", "score": 78, "status": "Optimal" },
      { "date": "2026-09-04", "score": 62, "status": "Caution" },
      { "date": "2026-09-05", "score": 55, "status": "Caution" },
      { "date": "2026-09-06", "score": 88, "status": "Optimal" },
      { "date": "2026-09-07", "score": 64, "status": "Caution" }
    ]
  }
}
```

---

## 3. Ma trận Xử lý Ngoại lệ và Mã lỗi (Error Handling Matrix)

| Mã HTTP | Mã lỗi Hệ thống | Nguyên nhân phát sinh | Hành vi xử lý trên Giao diện NTRevo |
| :--- | :--- | :--- | :--- |
| **400 Bad Request** | `INVALID_BIOMETRIC_DATA` | Giờ ngủ âm, hoặc nhịp tim ngoài phạm vi người sống ($<20$ hoặc $>250$). | Hiển thị thông báo đỏ ngay dưới ô nhập liệu và rung phản hồi (Haptic). |
| **401 Unauthorized** | `TOKEN_EXPIRED` | Phiên đăng nhập hết hạn. | Tự động điều hướng về màn hình đăng nhập và lưu tạm bản nháp chỉ số. |
| **422 Unprocessable** | `MISSING_MUSCLE_INTENSITY` | Chọn nhóm cơ bị đau nhưng không chọn mức độ đau (1-10). | Highlight viền đỏ xung quanh nhóm cơ đó trên bản đồ. |
| **503 Service Temp** | `AI_RECOVERY_ENGINE_BUSY` | Mô hình AI tính toán quá tải hoặc đang khởi động lại. | Tự động chuyển sang chế độ tính toán Fallback (Heuristic Rules) và thông báo cho người dùng. |
