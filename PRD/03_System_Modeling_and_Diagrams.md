# MÔ HÌNH HÓA HỆ THỐNG VÀ SƠ ĐỒ YÊU CẦU (SYSTEM MODELING & DIAGRAMS)
**Dự án:** SmartTask AI Hub  
**Chương 3:** 3.3 Phân tích Yêu cầu & Mô hình hóa  

---

## 1. Sơ đồ Trường hợp Sử dụng (Use Case Diagram)

Dưới đây là sơ đồ mô tả tương tác giữa các tác nhân (Product Owner, Developer, AI Assistant) và hệ thống SmartTask AI Hub:

```mermaid
graph TD
    subgraph Users ["Các Tác nhân (Actors)"]
        PO["Product Owner / PM"]
        DEV["Developer / Team Member"]
        AI["AI Engine Assistant"]
    end

    subgraph System ["SmartTask AI Hub System"]
        UC01["UC01: Xem Bảng Kanban"]
        UC02["UC02: Kéo thả Thẻ Task"]
        UC03["UC03: Kích hoạt AI Auto-Breakdown"]
        UC04["UC04: Nhập Prompt Yêu cầu"]
        UC05["UC05: Sinh Tài liệu PRD & User Stories"]
        UC06["UC06: Xuất Tài liệu Markdown"]
    end

    PO --> UC01
    PO --> UC04
    PO --> UC05
    PO --> UC06

    DEV --> UC01
    DEV --> UC02
    DEV --> UC03

    UC03 -.-> |Gọi dịch vụ| AI
    UC05 -.-> |Phân tích cú pháp| AI
```

---

## 2. Sơ đồ Tuần tự: Tính năng Tự động Bóc tách Công việc (Sequence Diagram - AI Breakdown)

Mô tả luồng tương tác khi người dùng bấm nút "✨ AI Auto-Breakdown":

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer / PM
    participant UI as Giao diện Kanban (Browser)
    participant Engine as AI Breakdown Handler (JS)
    participant Model as AI Reasoning Engine
    participant DOM as Kanban Board (DOM State)

    Dev->>UI: Bấm nút "✨ AI Auto-Breakdown"
    UI->>Engine: Gửi tín hiệu triggerAIBreakdown()
    Engine->>UI: Kích hoạt hiệu ứng Loading trên nút
    Engine->>Model: Gửi Prompt mẫu bóc tách nghiệp vụ
    Note over Model: Mô hình AI phân tích:<br/>- Tách nhỏ mục tiêu<br/>- Sinh danh sách Sub-tasks<br/>- Gán nhãn phù hợp
    Model-->>Engine: Trả về cấu trúc Task JSON (Title, Description, Tags)
    Engine->>DOM: Tạo phần tử Task Card mới với draggable=true
    DOM-->>UI: Hiển thị Thẻ Task mới xuất hiện tại cột 'To Do'
    UI-->>Dev: Hiển thị thông báo Toast: "Tác vụ mới đã được tạo bởi AI!"
```

---

## 3. Sơ đồ Tuần tự: Tính năng Sinh PRD & User Stories (Sequence Diagram - PRD Generator)

Mô tả luồng tương tác tại màn hình `ai-generator.html`:

```mermaid
sequenceDiagram
    autonumber
    actor PO as Product Owner
    participant UI as Màn hình Generator
    participant Validator as Input Validator
    participant AI as AI PRD Generator
    participant ResultBox as Result Preview Area

    PO->>UI: Nhập ý tưởng thô vào textarea
    PO->>UI: Nhấn nút "🚀 Phân tích bằng AI"
    UI->>Validator: Kiểm tra dữ liệu đầu vào (Prompt length > 0)
    alt Dữ liệu rỗng
        Validator-->>UI: Báo lỗi "Vui lòng nhập ý tưởng trước khi phân tích!"
    else Dữ liệu hợp lệ
        Validator->>UI: Hiển thị khung chờ "⏳ AI đang phân tích yêu cầu..."
        UI->>AI: Gửi Payload yêu cầu sinh PRD
        Note over AI: Áp dụng Persona BA:<br/>1. Trích xuất Epic<br/>2. Viết User Story theo INVEST<br/>3. Định dạng Given-When-Then
        AI-->>ResultBox: Đổ dữ liệu HTML/Markdown đã định dạng
        ResultBox-->>PO: Hiển thị kết quả hoàn chỉnh có thể sao chép
    end
```

---

## 4. Sơ đồ Trạng thái của Công việc (State Machine Diagram - Task Lifecycle)

Vòng đời của một Task từ khi được AI sinh ra đến khi hoàn thành:

```mermaid
stateDiagram-v2
    [*] --> Draft: Người dùng nhập ý tưởng
    Draft --> ToDo: AI bóc tách & Tạo thẻ Task
    
    ToDo --> InProgress: Kéo thẻ sang cột 'In Progress'
    InProgress --> ToDo: Trả về nếu cần bổ sung yêu cầu
    
    InProgress --> Review: Kéo thẻ sang cột 'Review' khi code xong
    Review --> InProgress: Yêu cầu sửa đổi / Fix bugs
    
    Review --> Done: Đạt toàn bộ Tiêu chí Nghiệm thu (AC)
    Done --> [*]: Đóng công việc & Lưu vết lịch sử
```

---

## 5. Sơ đồ Mô hình Dữ liệu Nghiệp vụ (Domain Entity Relationship Model)

```mermaid
erDiagram
    PROJECT ||--|{ SPRINT : contains
    SPRINT ||--|{ TASK : schedules
    TASK ||--|{ SUBTASK : decomposes_into
    TASK ||--o{ TAG : categorized_by
    TASK ||--|| ACCEPTANCE_CRITERIA : validated_by

    PROJECT {
        string id PK
        string name
        string vision
    }

    TASK {
        string id PK
        string title
        string description
        string status "ToDo | InProgress | Review | Done"
        string priority "P0 | P1 | P2"
        boolean is_ai_generated
    }

    SUBTASK {
        string id PK
        string task_id FK
        string content
        boolean is_completed
    }

    ACCEPTANCE_CRITERIA {
        string id PK
        string task_id FK
        string given_clause
        string when_clause
        string then_clause
    }
```
