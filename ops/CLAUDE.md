# ToolCraft 运营工作台

> 第5周 · 内容深化 · 2026-07-10
> 主项目：`D:\ai\toolkit-site`

## 本周任务（第5周：7/13-7/17）

| 日期 | 任务 | 状态 |
|:--:|------|:--:|
| 周一 7/13 | 博客选题 + 工具页面内容增强 | ⬜ |
| 周二 7/14 | Blog #13 发布 | ⬜ |
| 周三 7/15 | Blog #14 发布 + 工具 SEO 优化 | ⬜ |
| 周四 7/16 | Blog #15 发布 | ⬜ |
| 周五 7/17 | 本周复盘 + GSC/GA4 数据检查 | ⬜ |
| 每日 | Twitter 推文（恢复每日 1 条） | ⬜ |
| 持续 | Pinterest 每周 ≥2 Pin | ⬜ |

## 部署

```bash
git push && ssh root@124.156.154.129 "cd /opt/toolkit_site && git pull && npm run build && systemctl restart toolkit-site"
```

## 数据采集

```bash
cd D:\ai\toolkit-site && npx tsx scripts/ga4-fetch.ts   # 拉取 GA4 数据（自 7/8 起）
```

## 文件索引

| 想看什么 | 文件 |
|---------|------|
| **本周任务 + 部署** | 本文件 |
| **博客日历 + 发布状态** | `tracking/blog-progress.md` |
| **外链建设进度** | `tracking/link-building.md` |
| **社交媒体账号 + 模板** | `tracking/social-media.md` |
| **社交媒体发帖记录** | `content/social-posts.md` |
| **KPI 仪表盘** | `tracking/kpi-dashboard.md` |
| **每日 GA4 数据** | `tracking/daily-stats/` |
| **每周复盘报告** | `tracking/weekly-reports/` |
| **战略定位 + Markdown 优先** | `reference/strategy.md` |
| **12周路线图** | `reference/roadmap.md` |
| **日常节奏 + 发布 SOP** | `reference/workflow.md` |
| **运营素材（AlternativeTo等）** | `content/` |

## 关键状态

- 📝 博客：12 篇已发布，3 篇计划中
- 🔗 外链：SaaSHub 审核中、AlternativeTo 已提交、Ahrefs 已验证
- 📊 GA4：7/8 修复，日均 ~13 PV / 8 UV（3天数据）
- 🔍 IndexNow：已配置，每次构建自动提交
- 🐦 Twitter：13 条推文 / 📌 Pinterest：8 Pin

> ⚠️ **数据提示：** GA4 7/8 才修复，此前数据已归档 `tracking/daily-stats/_invalid/`。
> GA4 property `541266486` 仍混有旧项目数据流，需在后台清理。
