# AI Translator

A Raycast extension for intelligent text translation with automatic language detection.

## Features

- 🌐 **Automatic Language Detection**: AI-powered detection of input language
- 🔄 **Smart Translation Routing**: Automatically translates between your preferred languages
- ⚙️ **Custom API Support**: Works with OpenAI and compatible APIs
- 📋 **Instant Paste**: Translate and paste directly into active application
- ⌨️ **Multiple Commands**: Quick translate, preview mode, and form-based translation

## Commands

| Command                       | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| **Quick Translate**     | Auto-translate clipboard and paste instantly (no UI) |
| **Translate**           | Preview translation result, press Enter to paste     |
| **Translate (Form)**    | Manual translate with language selection form        |
| **Translate Selection** | Translate selected text and paste result             |

## Installation

### Option 1: Import Extension (Recommended)

Cài đặt extension một lần và sử dụng vĩnh viễn mà không cần chạy dev mode:

```bash
# 1. Clone hoặc download project
cd /path/to/ai-translator

# 2. Install dependencies
npm install

# 3. Build extension
npm run build
```

Sau đó trong Raycast:

1. Mở Raycast → nhấn `Cmd + ,` để mở Settings
2. Chọn tab **Extensions**
3. Nhấn nút **+** (góc dưới trái) → chọn **Import Extension**
4. Chọn thư mục `ai-translator`
5. Extension sẽ được import và sử dụng vĩnh viễn

### Option 2: Development Mode

Chạy extension ở chế độ development (cần mở terminal):

```bash
cd /path/to/ai-translator
npm install
npm run dev
```

> ⚠️ Extension chỉ hoạt động khi terminal đang chạy lệnh `npm run dev`

## How It Works

The extension uses AI to detect your input language and intelligently routes the translation:

- **Primary Language → Secondary Language**: If you input Vietnamese, it translates to English
- **Secondary Language → Primary Language**: If you input English, it translates to Vietnamese
- **Other Languages → Primary Language**: Any other language translates to your primary language

## Configuration

1. Open Raycast → `Cmd + ,` → Extensions → AI Translator
2. Configure the following:
   - **API Key**: Your OpenAI API key (required)
   - **API URL**: Base URL (default: `https://api.openai.com/v1/chat/completions`)
   - **AI Model**: Model to use (default: `gpt-3.5-turbo`)
   - **Primary Language**: Your main language (default: `Vietnamese`)
   - **Secondary Language**: Your second language (default: `English`)

## Usage Examples

**Quick Translate (Recommended)**:

1. Copy text to clipboard
2. Open Raycast → "Quick Translate"
3. Translation is automatically pasted to active app

**Translate (Preview Mode)**:

1. Copy text to clipboard
2. Open Raycast → "Translate"
3. Preview translation, press `Enter` to paste

**Translate Selection**:

1. Select text in any app
2. Open Raycast → "Translate Selection"
3. Translation replaces selected text

## Translation Examples

| Input                         | Output                        |
| ----------------------------- | ----------------------------- |
| Xin chào, bạn khỏe không? | Hello, how are you?           |
| Hello, how are you?           | Xin chào, bạn khỏe không? |
| Bonjour, comment allez-vous?  | Xin chào, bạn khỏe không? |

## Development

### Build & Lint

```bash
npm install
npm run build    # Build for distribution
npm run lint     # Check code style
```

### Publish to Raycast Store

1. Update `package.json`:

   - Set `author` to your Raycast username
   - Ensure `categories` is set (e.g., `["Productivity"]`)
2. Add screenshots (recommended 3-6):

   - Open Raycast Settings → Advanced → set hotkey for **Window Capture**
   - Run `npm run dev`, open command, press hotkey with "Save to Metadata" ticked
3. Publish:

   ```bash
   npm run publish
   ```

See [Raycast Docs](https://developers.raycast.com/basics/publish-an-extension) for details.

## Requirements

- Raycast
- OpenAI API key (or compatible service)

## License

MIT
