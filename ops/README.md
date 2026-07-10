# ToolCraft 运营工作台

> 进入此目录运行 `claude` 即可进入运营专用会话。
> CLAUDE.md 自动加载 → 本周任务 + 关键状态一目了然。

## 目录结构

```
ops/
├── CLAUDE.md                    会话入口（自动加载）
├── README.md                    本文件
│
├── reference/                   静态参考（策略、路线图、SOP）
│   ├── strategy.md              核心定位 + Markdown 优先策略
│   ├── roadmap.md               12周运营路线图
│   └── workflow.md              日常节奏 + 博客发布 SOP + 部署命令
│
├── tracking/                    动态追踪（唯一数据源）
│   ├── blog-progress.md         博客日历 + 发布状态（12已发布/3计划）
│   ├── link-building.md         外链建设进度（8个平台追踪）
│   ├── social-media.md          社交媒体账号 + 发布模板
│   ├── kpi-dashboard.md         KPI 仪表盘（每周更新）
│   ├── daily-stats/             GA4 每日数据（JSON，脚本自动生成）
│   └── weekly-reports/          每周复盘报告（week-1 ~ week-4）
│
├── content/                     运营素材
│   ├── social-posts.md          社交媒体发帖记录（Twitter/Pinterest/知乎）
│   ├── blog-schedule.md         博客排期
│   └── alternativeto-submission.md  AlternativeTo 提交素材
│
└── .claude/memory/              Claude Code 记忆系统（自动管理）
```

## 使用方式

```bash
cd ops
claude
# CLAUDE.md 自动加载，包含本周任务、部署命令、文件索引
```

## 日常更新指南

| 做了什么 | 更新哪个文件 |
|---------|------------|
| 发布新博客 | `tracking/blog-progress.md` |
| 提交新外链 | `tracking/link-building.md` |
| 发布社交内容 | `content/social-posts.md` + `tracking/social-media.md` |
| 拉取 GA4 数据 | `cd D:\ai\toolkit-site && npx tsx scripts/ga4-fetch.ts` |
| 每周复盘 | 新建 `tracking/weekly-reports/week-N.md` + 更新 `tracking/kpi-dashboard.md` |
| 进入新一周 | 更新 `CLAUDE.md` 本周任务表 |

## 相关文档（主项目）

- **[12周运营推广方案](../docs/OPERATIONS-PROMOTION-PLAN.md)**
- **[商业策略文档](../docs/BUSINESS-STRATEGY.md)**
