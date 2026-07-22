# ToolCraft 运营工作台

> 第6周 · 外链建设启动 · 2026-07-22（周三）
> 主项目：`D:\ai\toolkit-site`
> 📋 详细周计划：[tracking/weekly-plan.md](tracking/weekly-plan.md)

## 本周任务（第6周：7/20-7/24）

| 日期 | 任务 | 状态 |
|:--:|------|:--:|
| 周一 7/20 | 博客选题 + 外链目录清单整理 + 恢复 Twitter | ✅ |
| 周二 7/21 | Blog #17 发布 + 写 Blog #18 | ⬜ |
| 周三 7/22 | Blog #18 发布 + 外链提交 #1 + 写 Blog #19 | ⬜ |
| 周四 7/23 | Blog #19 发布 + 外链提交 #2 | ⬜ |
| 周五 7/24 | 本周复盘 + GSC/GA4 数据检查 + GSC 脚本 | ⬜ |
| 每日 | Twitter 推文（恢复每日 1 条，本周 1/5） | 🔄 |
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
| **详细周计划** | `tracking/weekly-plan.md` |
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

- 📝 博客：16 篇已发布，3 篇计划中（#17-19）
- 🔗 外链：SaaSHub 已放弃、AlternativeTo 已提交、Ahrefs 已验证
- 📊 GA4：7/8 修复，日均 ~27 PV / 6 UV（⚠️ 数据仍受旧项目污染，使用 property 541266486）
- 🔍 IndexNow：已配置，每次构建自动提交
- 🐦 Twitter：17 条推文 / 📌 Pinterest：10 Pin

> ⚠️ **数据提示：** GA4 7/8 才修复，此前数据已归档 `tracking/daily-stats/_invalid/`。
> GA4 property `543635611` 为新属性，数据干净。
