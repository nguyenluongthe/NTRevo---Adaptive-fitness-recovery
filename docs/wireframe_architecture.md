# 📐 KIẾN TRÚC THÀNH PHẦN WIREFRAME & CƠ SỞ BỐ CỤC (COMPONENT HIERARCHY)
## NTRevo Dynamic UI Generation System
**Tác giả:** Dev 1 - Backend Lead (`Dev1-BackendLead`)  
**Sprint:** 2 (Chương 4: AI trong Thiết kế Sản phẩm)  
**Tiêu chuẩn đáp ứng:** FR-003, FR-008, Usability WCAG 2.1  

---

## 1. MỤC ĐÍCH & Ý TƯỞNG THIẾT KẾ

Thay vì code cứng (hardcode) các form nhập liệu HTML truyền thống, hệ thống NTRevo áp dụng mô hình **Server-Driven UI (SDUI)**:
- Cấu trúc layout màn hình được mô tả dưới dạng khai báo bằng **JSON Schema** (`design/wireframe_schema.json`).
- Phía Client sử dụng bộ `WireframeRenderer` độc lập để parse và dựng DOM linh hoạt, giúp dễ dàng A/B testing các trường dữ liệu thể lực mà không cần sửa đổi mã nguồn ứng dụng.

---

## 2. PHÂN CẤP THÀNH PHẦN (COMPONENT HIERARCHY)

```
[Screen Layout Container: wireframe-root]
  ├── [Header Component]
  │     ├── Title & Subtitle
  │     ├── Version & Feature Badge
  │
  └── [Form: dynamic-wireframe-form]
        ├── [Section Card 1: Sức bền Tim mạch] (layout: grid-2)
        │     ├── [Component: NumberInput (Resting HR bpm)]
        │     └── [Component: NumberInput (VO2max)]
        │
        ├── [Section Card 2: Sức mạnh Cơ bắp] (layout: grid-3)
        │     ├── [Component: NumberInput (Push-ups Max)]
        │     ├── [Component: NumberInput (Plank seconds)]
        │     └── [Component: NumberInput (Squat 1RM kg)]
        │
        ├── [Section Card 3: Cảm nhận & Đau mỏi DOMS] (layout: grid-2)
        │     ├── [Component: RangeSlider (DOMS Scale 1-10)]
        │     └── [Component: TagSelector (Sore Muscle Groups)]
        │
        ├── [Action Bar]
        │     ├── [Button: Phân tích Điểm & Lưu Baseline] (Primary Accent #FF4500)
        │     └── [Button: Nạp Dữ liệu Mẫu (Biometrics)] (Secondary Zinc #27272A)
        │
        └── [Result Output: Dynamic Result Banner]
```

---

## 3. CƠ SỞ CHỌN MÀU SẮC & TRẢI NGHIỆM NGƯỜI DÙNG

1. **Nền tối sâu (Pure Dark `#09090B` & `#18181B`):** Giảm mỏi mắt cho vận động viên khi kiểm tra chỉ số vào sáng sớm hoặc trong phòng gym ánh sáng yếu.
2. **Điểm nhấn Cam Lửa (`#FF4500`):** Kích thích năng lượng, sự tập trung và đại diện cho nhịp đập tim mạch mạnh mẽ.
3. **Độ tương phản (Contrast Ratio):** Văn bản trắng `#FAFAFA` và `#E4E4E7` trên nền card `#18181B` đạt tỷ lệ tương phản **14.2:1**, vượt xa tiêu chuẩn WCAG 2.1 AA (4.5:1).
