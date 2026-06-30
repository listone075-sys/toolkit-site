# Browser Automation Scripts

半自动化社交媒体发布工具。使用 Playwright 持久化浏览器会话，你手动登录一次后，后续发布由脚本完成。

## 快速开始

### 1. 首次认证（只需一次）

```bash
# 登录 Twitter
node scripts/browser/auth.js twitter

# 登录 Pinterest
node scripts/browser/auth.js pinterest
```

浏览器会打开登录页面。手动登录后关闭浏览器，会话自动保存到 `~/.toolcraft-browser/`。

### 2. 日常发布

```bash
# 发推文
node scripts/browser/post-twitter.js --text "你的推文内容"

# 从文件发推文
node scripts/browser/post-twitter.js --file ./docs/social-media/twitter/tweet1.txt

# 发 Pin（需要先准备图片）
node scripts/browser/post-pinterest.js \
  --image ./public/social/pin-image-compressor.png \
  --title "Compress Images by 80%" \
  --description "Free online tool. No upload, no sign-up." \
  --link "https://toolcraftbox.com/tools/image-compressor" \
  --board "Image Tools & Tips"
```

### 3. 生成 Pin 图片

```bash
node scripts/browser/generate-pin-image.js \
  --title "你的 Pin 标题" \
  --subtitle "副标题（可选）" \
  --output ./public/social/my-pin.png
```

生成的图片为 1000×1500 PNG，适合 Pinterest。

### 4. 交互式发布向导

```bash
node scripts/browser/publish-pack.js ./docs/social-media/distribution-pack-week1.md
```

## 脚本说明

| 脚本 | 用途 |
|------|------|
| `auth.js` | 保存社交平台登录会话 |
| `post-twitter.js` | 发布推文 |
| `post-pinterest.js` | 创建 Pin（支持 `--batch` 批量） |
| `generate-pin-image.js` | 生成 Pin 图片 |
| `publish-pack.js` | 交互式批量发布向导 |

## 安全说明

- 登录凭证保存在本地 `~/.toolcraft-browser/`，不会上传
- 你可以随时删除该目录清除会话
- 如果会话过期，重新运行 `auth.js` 即可
