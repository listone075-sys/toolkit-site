# ToolCraft 运营工作台

> 第12周 · 复盘规划 · 2026-09-01（周一）
> 主项目：`D:\ai\toolkit-site`
> 📋 详细周计划：[tracking/weekly-plan.md](tracking/weekly-plan.md)
> 📊 12周路线图：第12周（8/31-9/4）为收官周

## 本周任务（第12周：8/31-9/4）

| 日期 | 任务 | 状态 |
|:--:|------|:--:|
| 周一 8/31 | 12 周运营复盘 + 下半年规划 | 🔄 |
| 周二 9/1 | tracking 数据同步 + 遗留外链提交 | 🔄 |
| 周三 9/2 | 下半年执行清单 + 博客恢复 | ⬜ |
| 周四 9/3 | 外链补提（需 VPN，Dev Hunt 等） | ⬜ |
| 周五 9/4 | 第12周收官 + 路线图更新 | ⬜ |
| 每日 | Twitter 推文（本周 0/5） | 🔄 |
| 持续 | Pinterest 每周 ≥2 Pin | ⬜ |

## 部署

```bash
git push && ssh root@124.156.154.129 "cd /opt/toolkit_site && git pull && npm run build && systemctl restart toolkit-site"
```

## 数据采集

```bash
cd D:\ai\toolkit-site && npx tsx scripts/ga4-fetch.ts   # 拉取 GA4 数据（自 7/8 起）
```

## 自动化能力（Playwright + Skill）

> 登录一次后零配合。用 Playwright 控制真实浏览器；首次需重启会话 + 手动登录一次。

| 能力 | 触发语 | Skill | 说明 |
|------|------|------|------|
| 外链目录提交 | "提交外链" | `submit-directories` | 自动填表提交 Dev Hunt / MicroLaunch / Fazier 等（CrozDesk 需企业邮箱、All My Faves 无表单，已弃） |
| Twitter 发推 | "发推" / "发条推" | `social-publish` | 短文案：1-2 句 + 链接 |
| Pinterest 发 Pin | "发Pin" | `social-publish` | 含博客截图生成 Pin 图 |

**首次使用**：重启会话后说"登录社交媒体"，在弹窗里手动登录 Twitter + Pinterest（仅一次），之后发帖零配合。遇到验证码 / 风控会停下等你处理。

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

- 📝 博客：19 篇全部发布 ✅（#17-19 已部署），第6-12周停更，待恢复
- 🔗 外链：仅 2 收录（AlternativeTo + LaunchingNext）；CrozDesk/All My Faves 已放弃，Dev Hunt/MicroLaunch/Fazier 待提交（需 VPN）
- 📊 GA4：日均 PV 12 / UV 4（7/8 起 43 天累计 515/172）⚠️ 8月起流量骤降，Organic 几乎为零
- 🔍 IndexNow：已配置，每次构建自动提交
- 🐦 Twitter：19 条推文 / 📌 Pinterest：12 Pin

> ⚠️ **数据提示：** GA4 7/8 才修复，此前数据已归档 `tracking/daily-stats/_invalid/`。
> GA4 property `543635611` 为新属性，数据干净。但 7/29 后流量明显下滑，需重点分析。
