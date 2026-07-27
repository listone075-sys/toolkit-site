# ToolCraft 运营工作台

> 第7周 · 外链突破 · 2026-07-27（周一）
> 主项目：`D:\ai\toolkit-site`
> 📋 详细周计划：[tracking/weekly-plan.md](tracking/weekly-plan.md)

## 本周任务（第7周：7/27-7/31）

| 日期 | 任务 | 状态 |
|:--:|------|:--:|
| 周一 7/27 | 博客部署 + Week 6 复盘 + Week 7 选题 | 🔄 |
| 周二 7/28 | Blog #20 发布 + 外链提交（CrozDesk + All My Faves） | ⬜ |
| 周三 7/29 | Blog #21 发布 + 外链提交（Dev Hunt + MicroLaunch） | ⬜ |
| 周四 7/30 | Blog #22 发布 + 外链提交（Fazier + 备选） | ⬜ |
| 周五 7/31 | Week 7 复盘 + GSC 数据脚本 + GA4 检查 | ⬜ |
| 每日 | Twitter 推文（本周 0/5） | 🔄 |
| 持续 | Pinterest 每周 ≥2 Pin（补上周） | ⬜ |

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

- 📝 博客：19 篇（16 已部署 + 3 待部署 #17-19），本周计划 3 篇（#20-22）
- 🔗 外链：CrozDesk + All My Faves 素材已备，本周提交 5 个目录
- 📊 GA4：property 541266486，日均 ~27 PV / 6 UV（⚠️ 混入旧项目数据）
- 🔍 IndexNow：已配置，每次构建自动提交
- 🐦 Twitter：17 条推文 / 📌 Pinterest：10 Pin（第6周掉队，第7周恢复）

> ⚠️ **数据提示：** GA4 7/8 才修复，此前数据已归档 `tracking/daily-stats/_invalid/`。
> GA4 property `543635611` 为新属性，数据干净。
