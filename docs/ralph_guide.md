# Hướng dẫn sử dụng Ralph Workflow trong dự án NTRevo

Hệ thống **Ralph** ([snarktank/ralph](https://github.com/snarktank/ralph)) là quy trình phát triển tính năng tự động lặp (autonomous loop) kết hợp giữa PRD chuẩn hóa và AI coding agents.

---

## 1. Cấu trúc đã cài đặt trong dự án

```text
NTRevo/
├── .agents/
│   └── skills/
│       ├── prd/
│       │   └── SKILL.md       # Skill tạo PRD có câu hỏi làm rõ
│       └── ralph/
│           └── SKILL.md       # Skill chuyển PRD thành prd.json chuẩn Ralph
├── scripts/
│   └── ralph/
│       ├── prompt.md          # System prompt hướng dẫn agent cho mỗi vòng lặp
│       ├── prd.json.example   # File mẫu cấu trúc prd.json
│       ├── ralph.ps1          # Script PowerShell chạy vòng lặp lặp lại trên Windows
│       └── ralph.sh           # Script Bash chạy trên macOS / Linux / WSL
└── tasks/                     # Nơi lưu trữ các file PRD dạng Markdown
```

---

## 2. Quy trình làm việc 3 bước

### Bước 1: Tạo PRD cho tính năng mới (`prd` skill)
Trong ô chat với Antigravity, bạn chỉ cần gõ:
> *"Tạo PRD cho tính năng [mô tả tính năng]"* hoặc *"create a prd for [feature]"*

Agent sẽ:
1. Đặt 3-5 câu hỏi trắc nghiệm nhanh (A, B, C, D) để làm rõ mục tiêu, đối tượng, phạm vi.
2. Bạn chỉ cần trả lời ngắn gọn (ví dụ: `1A, 2C, 3B`).
3. Agent tự động sinh file tài liệu đặc tả hoàn chỉnh lưu tại `tasks/prd-[tên-tính-năng].md`.

### Bước 2: Chuyển PRD thành `prd.json` (`ralph` skill)
Sau khi đã có file PRD trong `tasks/`, bạn yêu cầu:
> *"Chuyển PRD tasks/prd-[tên-tính-năng].md thành prd.json cho Ralph"* hoặc *"convert this prd to ralph"*

Agent sẽ:
1. Phân tách các tính năng lớn thành từng **User Story độc lập** (US-001, US-002,...).
2. Sắp xếp thứ tự ưu tiên theo phụ thuộc (Database/Schema -> Backend/API -> UI -> Tổng hợp).
3. Đảm bảo mỗi story đều có tiêu chí kiểm chứng rõ ràng (`Typecheck passes`, `Verify in browser`).
4. Xuất file `prd.json` ở thư mục gốc dự án.

### Bước 3: Thực thi vòng lặp code tự động
Có 2 cách thực thi:

#### Cách A: Chạy trực tiếp trong Antigravity (Khuyên dùng)
Bạn chỉ cần yêu cầu Antigravity:
> *"Hãy đọc prd.json và thực hiện story tiếp theo có passes: false"* hoặc *"Thực hiện quy trình Ralph cho prd.json"*

Antigravity sẽ:
- Chọn story có độ ưu tiên cao nhất chưa hoàn thành (`passes: false`).
- Code và chạy kiểm tra chất lượng (typecheck, lint, test).
- Khi kiểm tra thành công, commit git: `feat: [Story ID] - [Story Title]`.
- Đánh dấu `passes: true` trong `prd.json` và ghi nhật ký học hỏi vào `progress.txt`.
- Lặp lại cho đến khi toàn bộ story hoàn tất!

#### Cách B: Chạy qua Script Loop Runner (Amp / Claude CLI)
Nếu bạn cài đặt công cụ CLI bên ngoài (Amp CLI hoặc Claude Code CLI):
- **Trên Windows PowerShell:**
  ```powershell
  .\scripts\ralph\ralph.ps1 -Tool amp -MaxIterations 10
  # hoặc dùng Claude:
  .\scripts\ralph\ralph.ps1 -Tool claude -MaxIterations 10
  ```
- **Trên Git Bash / WSL:**
  ```bash
  chmod +x ./scripts/ralph/ralph.sh
  ./scripts/ralph/ralph.sh --tool amp 10
  ```
