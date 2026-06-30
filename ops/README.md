# ToolCraft 运营工作台

> 进入此目录运行 `claude` 即可进入运营专用会话。

## 目录结构

```
ops/
├── CLAUDE.md              ← Claude Code 启动时自动加载
├── README.md              ← 本文件
├── .claude/memory/        ← 运营专属记忆
│   ├── MEMORY.md          ←   记忆索引
│   ├── link-building.md   ←   外链建设进度
│   ├── content-calendar.md←   内容日历
│   ├── social-accounts.md ←   社交媒体状态
│   └── deploy-info.md     ←   服务器部署信息
├── content/               ← 内容素材
│   ├── blog-schedule.md   ←   博客排期表
│   └── social-posts.md    ←   社交媒体发帖记录
├── tracking/              ← 数据追踪
│   ├── kpi-dashboard.md   ←   KPI 仪表盘
│   └── weekly-reports/    ←   每周复盘报告
└── assets/                ← 运营用图片/素材
```

## 使用方式

```bash
cd ops
claude
# 自动加载 CLAUDE.md + .claude/memory/ 中的所有记忆
```

## 核心文件

- **[CLAUDE.md](./CLAUDE.md)** — 运营总控文件，当前阶段、任务清单、日常节奏
- **[OPERATIONS-PROMOTION-PLAN.md](../docs/OPERATIONS-PROMOTION-PLAN.md)** — 完整12周方案（主项目docs）
- **[BUSINESS-STRATEGY.md](../docs/BUSINESS-STRATEGY.md)** — 商业策略文档（主项目docs）
