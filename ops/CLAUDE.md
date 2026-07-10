# ToolCraft 运营工作台

> 当前阶段：12周运营推广计划 · 第5周
> 上次更新：2026-07-10
> 主项目路径：`D:\ai\toolkit-site`
> 
> ## ⚠️ 数据更正（2026-07-08）
> 
> **GA4 此前从未正常工作！** `NEXT_PUBLIC_GA_ID` 未在构建环境配置，Analytics 组件返回 null。已于 7/8 修复：
> - 本地 `.env.local` + 服务器 `.env.local` 均已补上 `NEXT_PUBLIC_GA_ID=G-JRNJX5CQ1F`
> - 服务器已重新构建部署（`npm run build` 时正确读取 env var）
> - 所有旧 daily-stats 已归档至 `tracking/daily-stats/_invalid/`（数据来自其他项目污染）
> - KPI 仪表盘已重置，从零开始积累
> 
> ## 🎯 战略方向更新（2026-07-02）
> 
> **决策：Markdown 优先策略已确认**
> - 主推 Markdown 品类（10 个工具 + 7 篇博客），PDF 辅助
> - 核心差异化：纯客户端处理隐私 + AI 推荐流量（ChatGPT/Claude 输出 Markdown）
> - 研发已安排：Markdown 统一工作台 + 首页设计强化
> - 博客方向：AI+Markdown 场景化内容（ChatGPT 转文档、技术写作、研究笔记）

## 运营目录说明

本目录是 ToolCraft 的运营指挥中心。进入此目录启动 Claude Code 时，会自动加载运营上下文：内容日历、外链进度、社交媒体状态、KPI 数据全部在此。

主项目 `D:\ai\toolkit-site` 的 CLAUDE.md 包含所有技术细节（部署、架构、代码规范）。本目录只关注运营执行。

---

## 项目概况

**toolcraftbox.com** — 48款免费在线工具，5个品类（Image/PDF/Markdown/Dev/Calculator），纯浏览器端处理，不上传文件。

### 核心卖点
- 🔒 纯客户端处理 — 隐私安全（核心差异化）
- 🆓 完全免费 — 无需注册
- 🚀 即时处理 — 无需等待上传

### 部署
- 服务器：124.156.154.129 (root)，香港 VPS
- 项目路径：`/opt/toolkit_site`
- 服务：`systemctl restart toolkit-site` (端口 8001)
- 部署命令：`git push && ssh root@124.156.154.129 "cd /opt/toolkit_site && git pull && npm run build && systemctl restart toolkit-site"`

---

## 当前阶段：12周运营推广计划（第5周）

### 12周路线图总览

| 周 | 主题 | 核心任务 |
|:--:|------|---------|
| 1 | 基础搭建 | GSC/GA4/Bing 验证、社交媒体账号、第一篇博客 |
| 2 | 内容启动 | 社交媒体矩阵、目录提交、2-3篇博客 |
| 3 | 内容加速 | 4篇博客、外链建设、社交媒体日常运营 |
| 4 | 工具优化 | 3篇博客、IndexNow、GA4修复、Claude Session Viewer |
| **5** | **内容深化** | **3-4篇博客、工具页面内容增强** ← 当前 |
| 6 | 扩展分发 | TikTok视频、邮件序列、ProductHunt准备 |
| 7 | 外链突破 | 大规模外链建设、竞品对比博客 |
| 8 | 数据优化 | SEO审计、Core Web Vitals、转化率优化 |
| 9 | 社媒放大 | 社交内容加速、社区互动 |
| 10 | 内容爆发 | 5篇+博客、多语言扩展 |
| 11 | 变现测试 | 广告位优化、Pro计划调研 |
| 12 | 复盘规划 | 12周复盘、下半年规划 |

### 第4周复盘

**第4周（7/6-7/10）完成情况：**
- ✅ IndexNow KEY 配置完成 + postbuild 自动提交修复
- ✅ 新增博客 3 篇：Blog #10 Markdown Cheat Sheet + #11 Technical Writing + #12 Clean Up ChatGPT Output
- ✅ GA4 修复（`NEXT_PUBLIC_GA_ID` 配置）并重新部署
- ✅ 新工具：Claude Code Session Viewer
- ✅ Twitter 推文 #12, #13
- ✅ Pinterest Pin #6, #7, #8（超额：3/2）
- ✅ Ahrefs Webmaster 注册 + 验证脚本部署
- ✅ 本周复盘完成 → `ops/tracking/weekly-reports/week-4.md`
- ⚠️ Blog #12 话题变更：PDF vs Desktop → Clean Up ChatGPT Output（延续 AI+Markdown 方向）
- ⚠️ Twitter 仅 2 条（目标 5 条），下周需恢复节奏
- ❓ AlternativeTo 待确认是否实际提交

### 本周（第5周）任务清单 — 内容深化

| 日期 | 核心任务 | 状态 |
|:---:|---------|:---:|
| 周一 7/13 | 博客选题 + 工具页面内容增强 | ⬜ |
| 周二 7/14 | Blog #13 发布 | ⬜ |
| 周三 7/15 | Blog #14 发布 + 工具 SEO 优化 | ⬜ |
| 周四 7/16 | Blog #15 发布 | ⬜ |
| 周五 7/17 | 本周复盘 + GSC/GA4 数据检查 | ⬜ |
| 每日 | Twitter 推文发布（恢复每日 1 条） | ⬜ |
| 持续 | Pinterest 每周至少 2 个 Pin | ⬜ |

---

## 内容日历

### 博客发布进度

| # | 日期 | 标题 | 品类 | 状态 |
|:--:|------|------|------|:--:|
| 1 | 6/26 | How to Create QR Codes for Free | Dev Tools | ✅ 已发布 |
| 2 | 6/30 | Online vs Desktop Image Compression | Image 对比 | ✅ 已发布 |
| 3 | 7/1 | Complete Guide to Image Compression for Website Performance | Image 深度 | ✅ 已发布 |
| 4 | 7/1 | How to Convert Markdown to HTML, DOCX, and PDF | Markdown How-to | ✅ 已发布 |
| 5 | 7/2 | How to Convert PDF to JPG or PNG | PDF How-to | ✅ 已发布 |
| 6 | 7/3 | Best Image Format for Social Media 2026 | Image | ✅ 已发布 |
| 7 | 7/4 | Markdown vs WYSIWYG: Which Should You Use in 2026? | Markdown | ✅ 已发布 |
| 8 | 7/2 | How to Convert ChatGPT & Claude Responses to Word or PDF | Markdown AI | ✅ 已发布 |
| 9 | 7/3 | ChatGPT 的回答怎么保存？转 Word/PDF 完整攻略 | Markdown ZH | ✅ 已发布 |
| 10 | 7/6 | Markdown Cheat Sheet — Complete Quick Reference (EN+ZH) | Markdown | ✅ 已发布 |
| 11 | 7/7 | How to Use Markdown for Technical Writing with AI (EN+ZH) | Markdown AI | ✅ 已发布 |
| 12 | 7/8 | How to Clean Up ChatGPT Output Formatting (EN+ZH) | Markdown AI | ✅ 已发布 |
| 13 | 7/14 | [选题待定] | - | 📝 计划中 |
| 14 | 7/15 | [选题待定] | - | 📝 计划中 |
| 15 | 7/16 | [选题待定] | - | 📝 计划中 |

### 内容轮换规则（2026-07-02 更新：Markdown 优先策略）
**新策略：Markdown 品类优先（每周至少2篇），搭配 Image/PDF**
- 内容方向以 AI+Markdown 场景化为核心
- ChatGPT/Claude 转 Word/PDF → 技术写作 → 研究笔记 → PPT制作等

### 每篇博客发布后必做
1. ✅ 写 Twitter 推文（3个版本：问题式 / 数据式 / CTA式）
2. ✅ 写 Pinterest Pin 描述（含标题、描述、目标Board）
3. ✅ 提交 IndexNow（Bing）— 如果 KEY 已配置
4. ✅ 在主站博客列表确认可访问

---

## 社交媒体矩阵

### Twitter/X — @ToolCraftBox
- 状态：✅ 已注册，首条推文已发布
- 策略：每日1条，3种类型轮换（问题式 → 数据式 → CTA式）
- 标签：#buildinpublic #webdev #freetools
- 头像/封面：`public/social/twitter-avatar.png` / `public/social/twitter-cover.png`

### Pinterest — toolcraftbox
- 状态：✅ 商业账号转换成功（7/3）
- 发 Pin 策略：每周至少 2 个，配合新博客发布
- 策略：AI+Markdown Pin 为主（ChatGPT 转文档、技术写作等）
- 目标 Board：Image Tools & Tips / PDF Hacks & Tutorials / Markdown for Beginners / Free Online Tools / Developer Resources
- Rich Pins：OG标签已配置 ✅，可验证

### 其他平台
- TikTok：待创建
- ProductHunt：待准备 Coming Soon 页面
- AlternativeTo：已注册，7/7 后可提交

---

## 外链建设

### 进度

| 平台 | 状态 | 日期 |
|------|:---:|------|
| SaaSHub | ✅ 已提交，等待审核 | 6/30 |
| AlternativeTo | ✅ 已提交 | 7/7 |
| ProductHunt | ⏳ 待准备素材 | - |
| Bing Webmaster | ✅ 已验证 + IndexNow 已配置 | 7/6 |
| Ahrefs Webmaster | ✅ 已验证（脚本部署） | 7/10 |

### IndexNow
- 状态：⚠️ INDEXNOW_KEY 未设置
- 需要：生成 key → 设为环境变量 → 每次发布博客后提交 URL

---

## KPI 仪表盘

| 指标 | 当前 | 3个月目标 |
|------|------|----------|
| 收录页面 (Google) | 待查 | > 100 |
| 收录页面 (Bing) | 待查 | > 50 |
| 博客文章 | 4 篇 (第3周) | 40 |
| 社交媒体粉丝 | 待统计 | 200 |
| 邮件订阅 | 待统计 | 500 |
| 外链域名 | ~1 (SaaSHub) | 20 |
| 日 PV | 待 GA 数据 | > 300 |

### 每周五复盘必查
1. Google Search Console：总点击、总展示、平均排名、已收录页面数
2. GA4：7天 PV/UV、平均停留时间、跳出率
3. 博客：本周发布数量、总字数、覆盖关键词
4. 社交：Twitter 互动、Pinterest 展示、新粉丝
5. 外链：新提交/新获得

---

## 日常运营节奏

### 每日
- 发布1条 Twitter 推文（从内容库取或新写）
- 检查 GSC 数据（索引状态、搜索查询）
- Pinterest 互动（浏览、Pin、关注）— 养号期间

### 每周
- 周一：本周内容选题 + 开始写第1篇博客
- 周二：第1篇博客发布 + 写第2篇
- 周三：第2篇博客发布 + 写第3篇
- 周四：第3篇博客发布 + 写第4篇
- 周五：本周复盘 + 下周规划 + 第4篇博客发布

### 博客发布流程
1. 写 EN 版本 → 写 ZH 版本
2. `git add` → `git commit` → `git push`
3. SSH 部署：`ssh root@124.156.154.129 "cd /opt/toolkit_site && git pull && npm run build && systemctl restart toolkit-site"`
4. 写 Twitter 推文 + Pinterest Pin 描述
5. 用户手动发布社交内容
6. 更新本目录中的进度跟踪

---

## 待发布的社交内容

### 第3周博客4（Markdown转换指南）— Twitter 推文

```
Stop installing Pandoc just to convert Markdown.

Markdown → HTML → paste into your CMS
Markdown → DOCX → send to clients
HTML → Markdown → archive cleanly

All free. All in your browser. No upload.

https://toolcraftbox.com/en/blog/how-to-convert-markdown-to-html-docx-pdf
```

### 第3周博客4 — Pinterest Pin

- **标题：** How to Convert Markdown to HTML, DOCX & Plain Text — Free Guide
- **描述：** Learn 4 essential Markdown conversions: MD→HTML for websites, MD→DOCX for Word, MD→plain text, and HTML→MD for archiving. All free, browser-based, no sign-up.
- **链接：** `https://toolcraftbox.com/en/blog/how-to-convert-markdown-to-html-docx-pdf`
- **Board：** Markdown for Beginners

---

## 关键文件索引

| 文件 | 用途 |
|------|------|
| `../docs/OPERATIONS-PROMOTION-PLAN.md` | 完整12周运营推广方案 |
| `../docs/BUSINESS-STRATEGY.md` | 商业策略 · KPI · 变现路线图 |
| `../docs/social-media/` | 社交媒体账号素材和分发包 |
| `../docs/PROGRESS.md` | 项目技术进度 |
| `../src/content/blog/` | 博客 MDX 源文件 |
| `../public/social/` | 社交媒体图片素材 |

---

## 本周待办（截至 2026-07-06 周一）

1. [ ] **配置 IndexNow KEY** — 生成 key → 设为环境变量
2. [ ] **写 Blog #10: Markdown Cheat Sheet**（EN + ZH）
3. [ ] **7/7 提交 AlternativeTo**
4. [ ] 注册 Ahrefs Webmaster
5. [ ] 每日 Twitter 推文
6. [ ] Pinterest 每周至少 2 个 Pin
7. [ ] 确认 Cloudflare NS 传播状态
