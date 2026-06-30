# ToolCraft 运营工作台

> 当前阶段：12周运营推广计划 · 第3周
> 上次更新：2026-06-30
> 主项目路径：`D:\ai\toolkit-site`

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

## 当前阶段：12周运营推广计划（第3周）

### 12周路线图总览

| 周 | 主题 | 核心任务 |
|:--:|------|---------|
| 1 | 基础搭建 | GSC/GA4/Bing 验证、社交媒体账号、第一篇博客 |
| 2 | 内容启动 | 社交媒体矩阵、目录提交、2-3篇博客 |
| **3** | **内容加速** | **4篇博客、外链建设、社交媒体日常运营** ← 当前 |
| 4 | 工具优化 | 批量上传、搜索功能、PWA修复 |
| 5 | 内容深化 | 3-4篇博客、工具页面内容增强 |
| 6 | 扩展分发 | TikTok视频、邮件序列、ProductHunt准备 |
| 7 | 外链突破 | 大规模外链建设、竞品对比博客 |
| 8 | 数据优化 | SEO审计、Core Web Vitals、转化率优化 |
| 9 | 社媒放大 | 社交内容加速、社区互动 |
| 10 | 内容爆发 | 5篇+博客、多语言扩展 |
| 11 | 变现测试 | 广告位优化、Pro计划调研 |
| 12 | 复盘规划 | 12周复盘、下半年规划 |

### 本周（第3周）任务清单

- [x] 周一：QR Code 博客发布 + 社交媒体分发 ✅
- [x] 周二：Markdown 多格式转换博客发布 ✅
- [ ] 周三：PDF 品类博客（下一篇）
- [ ] 周四：Image 品类博客 或 工具对比类
- [ ] 周五：本周复盘 + 下周规划
- [ ] 每日：Twitter 推文发布
- [ ] 持续：Pinterest 账号养号（商业账号转换重试）

---

## 内容日历

### 博客发布进度

| # | 日期 | 标题 | 品类 | 状态 |
|:--:|------|------|------|:--:|
| 1 | 6/26 | How to Create QR Codes for Free | Dev Tools | ✅ 已发布 |
| 2 | 6/30 | Online vs Desktop Image Compression | Image 对比 | ✅ 已发布 |
| 3 | 7/1 | Complete Guide to Image Compression for Website Performance | Image 深度 | ✅ 已发布 |
| 4 | 7/1 | How to Convert Markdown to HTML, DOCX, and PDF | Markdown How-to | ✅ 已发布 |
| 5 | 7/2 | 待定（PDF 品类） | PDF | 📝 待写 |
| 6 | 7/3 | 待定（Image 或工具对比） | - | 📝 待写 |
| 7 | 7/5 | 待定（Markdown 深度/列表） | - | 📝 待规划 |

### 内容轮换规则
Image → Image → Markdown → **PDF** → Image → Markdown（避免同品类扎堆）

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
- 状态：⚠️ 个人账号，商业账号转换失败（"not eligible"）
- 养号中：关注账号、创建 Board、发 Pin
- 重试：2026-07-03 左右再次尝试商业账号转换
- 目标 Board：Image Tools & Tips / PDF Hacks & Tutorials / Markdown for Beginners / Free Online Tools / Developer Resources
- Rich Pins：OG标签已配置 ✅，需商业账号后验证
- Pin 素材：`public/social/pin-*.png`

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
| AlternativeTo | ⏳ 已注册，等待7天（7/7可提交） | 6/30 |
| ProductHunt | ⏳ 待准备素材 | - |
| Bing Webmaster | ✅ 已验证 | 6/26 |
| Ahrefs Webmaster | ⬜ 待注册 | - |

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

## 本周待办（截至 2026-07-04）

1. [ ] 写第5篇博客（PDF 品类）
2. [ ] 写第6篇博客（Image 或工具对比）
3. [ ] 每日 Twitter 推文
4. [ ] Pinterest 继续养号，7/3 左右重试商业账号
5. [ ] 注册 Ahrefs Webmaster
6. [ ] 配置 INDEXNOW_KEY
7. [ ] 提醒用户：Day 5 推文未发布
8. [ ] 周五复盘
