# 第3周复盘（2026-07-02 ~ 07-03）

> ⚠️ **数据更正通知（2026-07-08）**
> GA4 的 `NEXT_PUBLIC_GA_ID` 此前未在构建环境配置，Analytics 组件从未加载。周报中的所有流量数据（PV/UV）来自其他未知项目向同一 GA 属性发送的数据，**与 ToolCraft 无关**。已于 7/8 修复，此前所有 daily-stats 已归档至 `_invalid/`。

> 12周运营推广计划 · 第3周 — 内容加速

## 完成事项

### 战略决策
- ✅ **Markdown 优先策略确认** — 主推 Markdown 品类（10工具 + 7博客），AI 推荐流量方向
- ✅ 研发已安排：Markdown 统一工作台 + 首页设计强化

### 内容 — 2篇新博客（本周净增）
| # | 日期 | 标题 | 品类 |
|:--:|:--:|------|:---:|
| 8 | 7/2 | How to Convert ChatGPT & Claude Responses to Word or PDF (EN+ZH) | Markdown AI |
| 9 | 7/3 | ChatGPT 的回答怎么保存？转 Word/PDF 完整攻略（中文原创） | Markdown ZH |

> 累计博客总数：9 篇（含 EN+ZH 版本，57 个文件）

### 社交媒体
| 平台 | 本周发布 | 累计 |
|:---|:---:|:---:|
| Twitter 推文 | #10, #11 | 11 条 |
| Pinterest Pin | #3(Convert PDF), #4(ChatGPT→Word), #5(ChatGPT保存攻略) | 5 个 |
| Pinterest 商业账号 | ✅ 转换成功 | - |

### 技术改进
- ✅ OG 标签修复：博客页面添加 `article:published_time` + `article:author`
- ✅ 已部署到生产环境

### 外链
- ✅ SaaSHub 审核中（无变化）
- ⏳ AlternativeTo — 7/7 可提交（倒计时 4 天）
- ⬜ Ahrefs Webmaster — 未注册
- ⬜ ProductHunt — 未开始

## 流量数据

| 指标 | 第2周 | 第3周 | 变化 |
|------|:--:|:--:|:--:|
| 7日 PV | 217 | **129** | ↓40% |
| 7日 UV | 90 | **55** | ↓39% |
| 日均 PV | 31 | **16** | ↓48% |
| 日均 UV | 13 | **7** | ↓46% |

> ⚠️ **数据说明：** 下降主要因为前两周的旧数据滚出7天窗口。目前数据有限，GA4 中仍包含 `/events.html`、`/backtest.html`、`/knowledge.html` 等非 ToolCraft 路径。实际 ToolCraft 流量仍在极低水平（< 5 PV/天）。
>
> 🔍 全部流量来源为 Direct（54 用户 / 129 PV），无 Organic Search 来源 — 符合预期，SEO 需要时间积累。

## 阻塞项

| 项目 | 状态 | 影响 |
|:---|:---:|:---|
| IndexNow KEY 未配置 | 🔴 | 博客发布后无法通知 Bing 快速收录 |
| Ahrefs Webmaster 未注册 | 🟡 | 缺少外链数据分析工具 |
| 自然搜索流量为 0 | 🟡 | 符合预期，SaaS 工具站 SEO 通常 3-6 月开始见效 |

## 下周规划（第4周：工具优化）

### 博客选题（Markdown 优先）
1. **Blog #10: Markdown Cheat Sheet** — 速查表，高搜索量，低竞争（EN + ZH）
2. **Blog #11: How to Use Markdown for Technical Writing** — AI+技术写作场景（EN + ZH）
3. **Blog #12: Online PDF Tools vs Desktop Software** — 对比类，高搜索量（EN + ZH）

### 重点任务
1. 🔴 **配置 IndexNow KEY** — 每次发布博客后自动提交 Bing
2. ⚠️ **AlternativeTo 提交** — 7/7 可提交
3. ⚠️ **注册 Ahrefs Webmaster**
4. 继续 Twitter 每日推文
5. Pinterest 继续发 Pin（至少 2 个/周）

### 流量目标
| 指标 | 当前 | 2周目标 |
|------|:--:|:--:|
| 日均 PV | 16 | > 50 |
| 日均 UV | 7 | > 30 |
| Organic Search | 0 | 开始出现 |
