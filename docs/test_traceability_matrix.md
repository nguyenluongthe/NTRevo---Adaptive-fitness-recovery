# 📊 MA TRẬN TRUY VẾT KIỂM THỬ (REQUIREMENTS TRACEABILITY MATRIX - RTM)
## NTRevo Adaptive Fitness & Recovery Platform
**Tác giả:** Dev 2 - Frontend Lead & QA Specialist (`Dev2-FrontendQA`)  
**Sprint:** 6 (Chương 8: AI trong Kiểm thử Phần mềm)  
**Tiêu chuẩn đáp ứng:** NFR-Maintainability, IEEE 829 Standard, 100% Functional Requirements Coverage  

---

## 1. TỔNG QUAN ĐỘ PHỦ KIỂM THỬ (TEST COVERAGE OVERVIEW)

* **Tổng số Yêu cầu Chức năng (FRs):** 20/20 (100%)
* **Tổng số Ca kiểm thử Đơn vị (Unit Test Cases):** 36/36 Passed (100%)
* **Tổng số Ca kiểm thử Đầu cuối (E2E Test Scenarios):** 5/5 User Journeys Passed (100%)
* **Tỷ lệ truy vết thành công (Traceability Rate):** **100.0%** (Không có yêu cầu mồ côi - No Orphan Requirements)

---

## 2. BẢNG MA TRẬN CHI TIẾT 20 YÊU CẦU CHỨC NĂNG (FR-001 ĐẾN FR-020)

| ID Yêu cầu | Mô tả Tóm tắt Yêu cầu Chức năng | User Story Ánh xạ | BDD Gherkin Scenario | Unit Test ID | E2E Test Case ID | Trạng thái |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: |
| **FR-001** | Đăng ký & Xác thực JWT Athlete/Coach | US-001 | `onboarding_plan.feature:L8` | `UT-AUTH-01` | `E2E-01` | 🟢 PASS |
| **FR-002** | Khởi tạo Hồ sơ Nhân trắc học & Thể hình | US-002 | `onboarding_plan.feature:L24` | `UT-AUTH-02` | `E2E-01` | 🟢 PASS |
| **FR-003** | Đánh giá Thể lực Ban đầu & Tính FitnessScore | US-003 | `fitness_assessment.feature:L6` | `UT-ASM-01` | `E2E-02` | 🟢 PASS |
| **FR-004** | Thu thập Chỉ số Sinh trắc học Sáng (HRV/Sleep) | US-004 | `biometrics_sync.feature:L10` | `UT-BIO-01` | `E2E-03` | 🟢 PASS |
| **FR-005** | Tính điểm Hồi phục Toàn diện Readiness Score | US-005 | `recovery_engine.feature:L5` | `UT-REC-01` | `E2E-03` | 🟢 PASS |
| **FR-006** | Phân loại Trạng thái Ngày tập (4 Cấp độ) | US-006 | `recovery_engine.feature:L28` | `UT-REC-02` | `E2E-03` | 🟢 PASS |
| **FR-007** | Tự động Điều chỉnh Khối lượng (Volume Multiplier) | US-007 | `adaptive_workout.feature:L12` | `UT-VOL-01` | `E2E-04` | 🟢 PASS |
| **FR-008** | Tự điều hòa Cường độ Tập luyện (RPE Target) | US-008 | `adaptive_workout.feature:L30` | `UT-INT-01` | `E2E-04` | 🟢 PASS |
| **FR-009** | Bản đồ Đau mỏi Cơ bắp Cục bộ (DOMS Soreness) | US-009 | `doms_mapping.feature:L8` | `UT-DOMS-01` | `E2E-04` | 🟢 PASS |
| **FR-010** | Hoán đổi Bài tập An toàn Tránh Chấn thương | US-010 | `exercise_swap.feature:L15` | `UT-SWAP-01` | `E2E-04` | 🟢 PASS |
| **FR-011** | Ghi nhận Set tập & Số Reps/Tạ Thời gian thực | US-011 | `workout_tracker.feature:L10` | `UT-LOG-01` | `E2E-04` | 🟢 PASS |
| **FR-012** | Tính toán Tổng Tải lượng Phiên tập (Tonnage) | US-012 | `workout_tracker.feature:L25` | `UT-TON-01` | `E2E-04` | 🟢 PASS |
| **FR-013** | Bộ đếm Giờ Nghỉ Nghỉ ngơi Thông minh (Rest Timer) | US-013 | `workout_tracker.feature:L40` | `UT-TIME-01` | `E2E-04` | 🟢 PASS |
| **FR-014** | Khóa Khẩn cấp Khi HRV Tụt Sốc (Safety Override) | US-014 | `overtraining.feature:L6` | `UT-SAFE-01` | `E2E-05` | 🟢 PASS |
| **FR-015** | Giao thức Hồi phục Thụ động Box Breathing | US-015 | `overtraining.feature:L22` | `UT-REST-01` | `E2E-05` | 🟢 PASS |
| **FR-016** | Trực quan hóa Biểu đồ Xu hướng HRV 7 Ngày | US-016 | `analytics.feature:L8` | `UT-CHART-01` | `E2E-03` | 🟢 PASS |
| **FR-017** | Trực quan hóa Biểu đồ Tải lượng Tập luyện 7 Ngày | US-017 | `analytics.feature:L20` | `UT-CHART-02` | `E2E-04` | 🟢 PASS |
| **FR-018** | Tự động Vô hiệu hóa Bộ nhớ đệm (Cache Invalidation) | US-018 | `cache_sync.feature:L12` | `UT-CACHE-01` | `E2E-05` | 🟢 PASS |
| **FR-019** | Tra cứu Hợp đồng OpenAPI 3.0 & Swagger UI | US-019 | `api_contract.feature:L5` | `UT-DOCS-01` | `E2E-01` | 🟢 PASS |
| **FR-020** | Tuân thủ Chuẩn Khả năng Tiếp cận WCAG 2.1 AA | US-020 | `accessibility.feature:L4` | `UT-WCAG-01` | `E2E-01` | 🟢 PASS |

---

## 3. KẾT LUẬN & CHỨNG NHẬN CHẤT LƯỢNG QA
Bộ ma trận kiểm thử xác nhận hệ thống đạt **độ tin cậy tối đa**:
- 100% các tính năng đều có kịch bản BDD tương ứng.
- Toàn bộ chuỗi API và luồng thao tác Frontend đều được kiểm tra liên tục trong quy trình CI/CD.
