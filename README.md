# AI Translator (Trình Dịch AI)

Một tiện ích mở rộng của Raycast dành cho việc dịch văn bản thông minh với khả năng tự động phát hiện ngôn ngữ.

## Cài Đặt

1.  Tải về file cài đặt có đuôi `.rayext` từ link được chia sẻ.
2.  Nháy đúp (double-click) vào file vừa tải về.
3.  Raycast sẽ tự động mở ra, bạn chỉ cần nhấn nút **Install** để hoàn tất.

## Cấu Hình Ban Đầu

Sau khi cài đặt, bạn cần cấu hình các thông tin cần thiết để extension hoạt động:

1. Mở Raycast → `Cmd + ,` → Extensions → AI Translator.
2. Cập nhật các mục sau:
   - **API Key**: API key của bạn cho dịch vụ OpenAI (bắt buộc).
   - **API URL**: URL cơ sở (mặc định: `https://api.openai.com/v1/chat/completions`).
   - **AI Model**: Model AI sử dụng (mặc định: `gpt-3.5-turbo`).
   - **Ngôn Ngữ Chính**: Ngôn ngữ chính của bạn (mặc định: `Vietnamese`).
   - **Ngôn Ngữ Phụ**: Ngôn ngữ thứ hai của bạn (mặc định: `English`).

## Cách Hoạt Động

Tiện ích mở rộng sử dụng AI để phát hiện ngôn ngữ nhập vào và định tuyến bản dịch một cách thông minh:

- **Ngôn Ngữ Chính → Ngôn Ngữ Phụ**: Nếu bạn nhập tiếng Việt, nó sẽ dịch sang tiếng Anh.
- **Ngôn Ngữ Phụ → Ngôn Ngữ Chính**: Nếu bạn nhập tiếng Anh, nó sẽ dịch sang tiếng Việt.
- **Ngôn Ngữ Khác → Ngôn Ngữ Chính**: Bất kỳ ngôn ngữ nào khác sẽ được dịch sang ngôn ngữ chính của bạn.

## Ví Dụ Sử Dụng

**Lệnh Dịch Nhanh (Khuyên Dùng)**:

1. Sao chép văn bản vào clipboard.
2. Mở Raycast → "Dịch Nhanh".
3. Bản dịch sẽ tự động được dán vào ứng dụng đang hoạt động.

**Lệnh Dịch (Chế Độ Xem Trước)**:

1. Sao chép văn bản vào clipboard.
2. Mở Raycast → "Dịch".
3. Xem trước bản dịch, nhấn `Enter` để dán.

**Lệnh Dịch Vùng Chọn**:

1. Chọn văn bản trong bất kỳ ứng dụng nào.
2. Mở Raycast → "Dịch Vùng Chọn".
3. Bản dịch sẽ thay thế văn bản đã chọn.

## Tính Năng

- 🌐 **Tự Động Phát Hiện Ngôn Ngữ**: Phát hiện ngôn ngữ nhập vào bằng trí tuệ nhân tạo.
- 🔄 **Luồng Dịch Thông Minh**: Tự động dịch giữa các ngôn ngữ bạn ưa thích.
- ⚙️ **Hỗ Trợ API Tùy Chỉnh**: Hoạt động với OpenAI và các API tương thích.
- 📋 **Dán Tức Thì**: Dịch và dán trực tiếp vào ứng dụng đang hoạt động.
- ⌨️ **Nhiều Lệnh**: Dịch nhanh, chế độ xem trước và dịch dựa trên biểu mẫu.

---

## Dành cho Nhà Phát triển (For Developers)

### Cài đặt từ Mã nguồn

Cài đặt extension một lần và sử dụng vĩnh viễn mà không cần chạy chế độ dev:

```bash
# 1. Clone hoặc tải về dự án
cd /duong/dan/toi/ai-translator

# 2. Cài đặt các dependencies
npm install

# 3. Build extension
npm run build
```

Sau đó trong Raycast, vào **Settings → Extensions → + → Import Extension** và chọn thư mục dự án.

### Xử lý lỗi `Could not find command's executable JS file`

Nếu bạn import extension từ file ZIP và gặp lỗi này, hãy chạy các lệnh sau trong thư mục dự án:

```bash
npm install
npm run build
```

### Đóng Gói và Chia Sẻ Extension

Để chia sẻ extension một cách riêng tư cho bạn bè, bạn có thể xuất bản nó lên Raycast Store dưới chế độ **Private**.

```bash
# Chạy lệnh publish
npx @raycast/api@latest publish
```

Trong quá trình xuất bản, hãy chọn chế độ `Private`. Sau khi hoàn tất, bạn sẽ nhận được một link cài đặt. Bất kỳ ai có link này đều có thể cài đặt extension của bạn một cách dễ dàng.

