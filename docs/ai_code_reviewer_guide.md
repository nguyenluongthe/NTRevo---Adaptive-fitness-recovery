# 🤖 HƯỚNG DẪN VẬN HÀNH & QUY TẮC BOT AI CODE REVIEWER
**Dự án:** NTRevo - Adaptive Fitness & Recovery Platform  
**Học phần:** Chương 7 - Tái cấu trúc & Review Mã nguồn cùng AI  
**Tác giả:** Dev 2 (`Dev2-FrontendQA`)  
**Tệp tin thực thi:** `scripts/ai_code_reviewer.py` & `.github/workflows/ai_review.yml`  

---

## 1. MỤC TIÊU & TỔNG QUAN HỆ THỐNG
Bot **AI Code Reviewer** được xây dựng nhằm tự động hóa quy trình rà soát mã nguồn (Pull Request Code Review), đảm bảo các tiêu chí đánh giá tự động:
- Phát hiện sớm các lỗ hổng bảo mật (Hardcoded Secrets, API Keys).
- Phát hiện Code Smells và nợ kỹ thuật (Debug logs còn sót lại, đánh dấu công việc chưa giải quyết).
- Đánh giá mức độ tuân thủ nguyên tắc thiết kế **Clean Code**, **SOLID** và chuẩn tiếp cận **WCAG 2.1**.
- Chấm điểm chất lượng mã nguồn **Clean Code Score (1 - 100)** và tự động đăng tải nhận xét (PR Comment) trực tiếp lên GitHub Pull Request.

---

## 2. BẢNG TIÊU CHÍ CHẤM ĐIỂM (SCORING RUBRIC)

Điểm ban đầu của mỗi Pull Request là **100 điểm**. Bot sẽ thực hiện trừ điểm khi phát hiện các vi phạm sau trên mã nguồn chương trình:

| Mức độ nghiêm trọng | Loại vi phạm | Mức phạt điểm | Giải thích & Biện pháp khắc phục |
| :---: | :--- | :---: | :--- |
| 🚨 **CRITICAL** | Lộ API Key, Token, Password | **-25 điểm** | Tuyệt đối không commit key bí mật lên Git. Bắt buộc chuyển sang tệp cấu hình `.env` hoặc GitHub Secrets. |
| ⚠️ **MEDIUM** | Nợ kỹ thuật dở dang trong code | **-5 điểm** | Các đầu việc dở dang cần được tạo Issue trên GitHub thay vì để rải rác trong mã nguồn. |
| ⚠️ **MEDIUM** | Kiểu dữ liệu lỏng lẻo (`any`) | **-4 điểm** | Giảm thiểu `any` trong TypeScript/JSDoc; định nghĩa Interface hoặc Type rõ ràng. |
| ℹ️ **LOW** | Lệnh debug log terminal | **-3 điểm** | Loại bỏ toàn bộ lệnh ghi log kiểm thử trước khi đẩy mã nguồn lên nhánh chính. |

### Phân loại xếp hạng điểm:
- 🟢 **85 - 100 điểm (XUẤT SẮC):** Đủ điều kiện Merge vào nhánh `develop` hoặc `main`.
- 🟡 **70 - 84 điểm (CẦN LƯU Ý):** Cần dev sửa chữa các cảnh báo Medium trước khi Approve.
- 🔴 **< 70 điểm (KHÔNG ĐẠT):** Bot tự động cảnh báo và yêu cầu sửa lỗi bảo mật khẩn cấp.

---

## 3. CÁCH THỨC VẬN HÀNH (EXECUTION MODES)

### 3.1 Chạy kiểm tra cục bộ trên máy lập trình viên (Local CLI)
Lập trình viên có thể tự chạy kiểm tra trước khi commit hoặc trước khi tạo PR:
```bash
# Kiểm tra diff so với commit trước đó
python scripts/ai_code_reviewer.py HEAD~1

# Hoặc kiểm tra diff so với nhánh develop
python scripts/ai_code_reviewer.py develop
```

### 3.2 Tự động kích hoạt trên GitHub Actions CI
Khi lập trình viên tạo Pull Request vào nhánh `develop` hoặc `main`:
1. GitHub Actions kích hoạt workflow `.github/workflows/ai_review.yml`.
2. Hệ thống checkout mã nguồn và thực hiện lệnh `git diff origin/<base_branch>`.
3. Bot chạy bộ phân tích AST và phân tích heuristic để chấm điểm Clean Code.
4. Bot sử dụng GitHub API để để lại nhận xét bảng chi tiết ngay trên giao diện PR.

---

## 4. KẾT HỢP VỚI QUY TRÌNH REVIEW CHÉO (PEER REVIEW 50/50)
- **Dev 1:** Sau khi Bot AI Review gửi nhận xét, Dev 1 đọc qua bảng điểm để xác nhận các gợi ý kiến trúc SOLID (Single Responsibility, Strategy Pattern).
- **Dev 2:** Đảm bảo mã nguồn UI/UX tuân thủ bảng màu WCAG 2.1 và không chứa các vi phạm giao diện tiếp cận.
- Cả hai thành viên chỉ bấm **Approve** khi điểm Clean Code đạt từ **85/100 trở lên**.
