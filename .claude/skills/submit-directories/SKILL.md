---
name: submit-directories
description: 自动向工具目录站（CrozDesk、All My Faves、Dev Hunt、MicroLaunch、Fazier）提交 ToolCraft 外链。用 Playwright MCP 控制浏览器打开提交页、自动填表、点击提交；遇到验证码/邮箱验证时停下让用户处理。素材在 ops/tracking/link-building.md。
---

# 外链目录提交自动化

用户说"提交外链"、"提交目录"、"submit to directories"、"提交 CrozDesk" 等即触发本 skill。

## 前置条件

- Playwright MCP 已配置（`D:\ai\toolkit-site\.mcp.json`），工具前缀为 `browser_*`（如 `browser_navigate`、`browser_snapshot`、`browser_type`、`browser_click`、`browser_select_option`、`browser_take_screenshot`、`browser_wait_for`）。
- 浏览器窗口可见（headless=false 默认），用户能看到进行到哪一步。

## 核心规则

1. **永远打开真实浏览器窗口**（Playwright MCP 默认 headed），每一步做完 `browser_snapshot` 确认页面状态再操作下一步。
2. **遇到人机验证（CAPTCHA / reCAPTCHA / hCaptcha / Turnstile）或需要邮箱/短信验证码时，立即停止**，把 `browser_take_screenshot` 的路径告诉用户，等用户处理完验证后问一句"验证过了吗"，再继续。**绝不尝试绕过验证。**
3. 提交前用 `browser_snapshot` 复核所有字段，确认无误再点提交。
4. 提交成功后，把结果写进 `ops/tracking/link-building.md`（状态改成 ✅ + 日期），并 git commit。
5. 每个目录的表单字段可能不同，用 `browser_snapshot` 读实际 DOM 再对应填，不要假设字段名。

## 通用提交流程

对每个目标目录执行：

1. `browser_navigate` 到该目录的提交/添加产品页
2. `browser_snapshot` 读取表单结构
3. 按素材逐字段填写（名称 / URL / tagline / 描述 / 分类 / 标签 / 联系方式）
4. `browser_take_screenshot` 截图确认
5. 遇到验证码 → 停下等用户
6. 点提交 → 确认成功提示
7. 更新 link-building.md

## 目标目录 + 提交入口

| 目录 | 提交入口 | 优先级 |
|------|------|:--:|
| CrozDesk | `https://www.crozdesk.com/for-vendors`（需 biz email，邮箱验证） | 1 |
| All My Faves | `https://www.allmyfaves.com/`（页面找 Add/Submit 入口，选 Technology 品类） | 2 |
| Dev Hunt | `https://devhunt.org/`（找 Launch/Submit 入口） | 3 |
| MicroLaunch | `https://microlaunch.net/`（找 Submit 入口） | 4 |
| Fazier | `https://fazier.com/`（找 Submit 入口） | 5 |

如果入口 URL 变更或 404，用 WebSearch 找最新的提交页 URL。

## ToolCraft 提交素材（来自 ops/tracking/link-building.md）

### 基本信息
- **Product Name:** ToolCraft — Free Online Tools
- **Website:** https://toolcraftbox.com
- **Tagline:** 48 free online tools for images, PDFs, Markdown, and development. All processing runs in your browser — no upload, no sign-up.
- **Category:** Productivity / Developer Tools / Technology
- **Pricing:** Free
- **Description:** ToolCraft is a collection of 48+ free browser-based tools for everyday digital tasks. Compress images, merge PDFs, convert Markdown to HTML/PDF/DOCX, generate QR codes, format JSON, and more. No sign-up. No upload. Everything runs locally in your browser for maximum privacy.
- **Tags:** free tools, online tools, image compressor, pdf tools, markdown converter, qr code generator

### 按目录微调
- **CrozDesk:** 用完整 Description；Pricing=Free；可能需要 Vendor email（问用户要，或提示用户填）
- **All My Faves:** Category 选 "Technology"；Description 用短版："ToolCraft — 48 free online tools. Image compression, PDF merge/split, Markdown conversion, QR code generator, JSON formatter, and more. No sign-up. No upload. All processing runs in your browser."
- **Dev Hunt / MicroLaunch:** 用 Tagline + 短 Description，突出 developer tools（JSON formatter, diff checker, base64, markdown）
- **Fazier:** 同 Dev Hunt

## 完成后

1. 更新 `ops/tracking/link-building.md` 对应平台状态为 ✅（日期）
2. 如有需要，也更新 `ops/CLAUDE.md` 的外链状态
3. git add + commit（message 如 `chore: submit to CrozDesk`）
4. 向用户汇报：提交了哪些、哪些卡在验证码、下一步是什么

## 注意事项

- 有的目录审核是人工的（CrozDesk、All My Faves 要审核），提交成功 ≠ 立即收录，告诉用户等待时间。
- 不要重复提交同一个目录（先查 link-building.md 状态）。
- 如果目标站反爬（弹出 Cloudflare challenge），停下来告诉用户，不要硬冲。
