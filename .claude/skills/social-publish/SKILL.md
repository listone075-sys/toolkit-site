---
name: social-publish
description: 自动发布 Twitter/X 推文和 Pinterest Pin。用 Playwright 控制持久化浏览器（--user-data-dir），登录一次后自动发帖。素材在 ops/content/social-posts.md。用户说"发推""发Twitter""发Pin""发Pinterest"即触发。
---

# 社交媒体自动发布

用户说"发推"、"发 Twitter"、"发条推"、"发 Pin"、"发 Pinterest"、"发社交媒体"等即触发本 skill。

## 前置条件

- Playwright MCP 已配置，且带 `--user-data-dir` 指向 `C:/Users/Administrator/.claude/playwright-profile`（持久化 profile，登录状态跨会话保留）。
- 首次使用需登录一次（见"登录流程"），之后无需重复。

## 账号

- **Twitter/X**：@ToolCraftBox（18 条历史推文）
- **Pinterest**：toolcraftbox（商业账号，5 个 Board：Image Tools & Tips / PDF Hacks & Tutorials / Markdown for Beginners / Free Online Tools / Developer Resources）

## 关键规则

1. 浏览器窗口可见，每步 `browser_snapshot` 确认状态。
2. **登录、验证码、2FA、账号风控解锁 —— 全部停下让用户处理**，绝不尝试绕过。
3. **推文风格（用户明确要求）：短，1-2 句话 + 链接，不要 emoji 列表式。** 见 [[tweet-length-preference]]。
4. 发布成功后更新 `ops/content/social-posts.md`（加一行记录），并 git commit。
5. 发帖文字优先从 `ops/content/social-posts.md` 已备素材取；若用户临时指定主题，按模板新写。

## 登录状态检查（每次发帖前先做）

1. `browser_navigate` 到目标平台首页（`https://x.com/home` 或 `https://www.pinterest.com`）
2. `browser_snapshot` 判断是否已登录：
   - Twitter 已登录 = 能看到发推框（"What's happening?"）或左下角头像
   - Pinterest 已登录 = 能看到右上角头像 / "Create" 按钮
3. 未登录 → 走下方"登录流程"；已登录 → 直接发布

## 登录流程（一次性，需用户配合）

1. `browser_navigate` 到登录页（`https://x.com/login` 或 `https://www.pinterest.com/login/`）
2. `browser_snapshot` 找到账号/密码输入框，但**不要自己填**——让用户在真实窗口里输入（避免把密码写进对话/日志）
3. 告诉用户："请在弹出的浏览器窗口输入账号密码并登录，遇到验证码也一并处理，完成后回复我"
4. 用户回复后，`browser_navigate` 到首页，`browser_snapshot` 确认已登录
5. 因为 `--user-data-dir` 持久化，登录状态会保留，之后不再需要

> ⚠️ 密码绝不由我代填，也不写进任何文件。登录由用户亲自完成。

## Twitter 发布流程（已登录状态）

1. `browser_navigate` 到 `https://x.com/home`
2. `browser_snapshot` 定位发推框（compose box）
3. 点击发推框，`browser_type` 输入推文文字
4. `browser_snapshot` 确认文字无误
5. 点击"发布 / Post"按钮
6. `browser_snapshot` 确认推文已出现
7. 更新 `ops/content/social-posts.md` Twitter 表 + git commit

推文素材来源：
- `ops/content/social-posts.md` 里标"待确认"/未发的版本
- 或按模板新写：`[问题/数据点/项目介绍] 1-2句 + 🔗链接`（链接指向对应博客或工具页）

## Pinterest 发布流程（已登录状态）

1. `browser_navigate` 到 `https://www.pinterest.com/pin-builder/`
2. 上传图片（Pin 必须有图）：
   - 优先用 `browser_file_upload` 上传本地图（如 `public/social/` 下素材，或对博客页 `browser_take_screenshot` 生成 2:3 图）
   - 无现成图时，先 `browser_navigate` 到博客页截图存本地，再上传
3. 填标题（Title）：`[How to / X Best / Complete Guide] + 关键词`
4. 填描述（Description）：`2-3句问题+解决方案 + "Save for later!" + 🔗链接`
5. 选 Board（按品类，见账号节）
6. 点"发布 / Publish"
7. 更新 `ops/content/social-posts.md` Pin 表 + git commit

Pin 文案素材在 `ops/content/social-posts.md` 已有 10+ 条历史记录，可直接复用或新写。

## 完成后

1. 更新 `ops/content/social-posts.md`（对应表加一行，状态 ✅）
2. 如需同步 `ops/tracking/social-media.md` 的累计数字
3. git add + commit（message 如 `chore: post tweet #19` / `chore: pin #11`）
4. 向用户汇报：发了什么、链接、下一步

## 注意事项

- Twitter 会话可能几周过期，发帖前检查登录状态（见上），过期就重新走登录流程。
- 若 X 触发风控（要求解锁、验证邮件），停下告诉用户，不硬冲。
- 不要重复发同一条（先查 social-posts.md 记录）。
- Pin 图片保持 2:3 比例（Pinterest 标准竖图，推荐 1000×1500）。
