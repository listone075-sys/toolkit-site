# ToolCraft 项目进度与规划文档

> 最后更新：2026-06-25 | 当前阶段：阶段 4（用户留存与增长）✅ 已完成

---

## 阶段总览

```
阶段 1 (第 1-2 周)  ██ 变现打底        ✅ 完成
阶段 2 (第 3-8 周)  ██████ 工具翻倍    ✅ 完成（42 工具）
阶段 3 (第 9-12 周) ██████ AI 差异化    ✅ 完成（48 工具）
阶段 4 (第 13-16 周)██████ 留存与增长   ✅ 完成
阶段 5 (第 17-24 周)██████ 规模加速     ⏳ 待开始
```

## 阶段 4 完成清单

### Bug 修复（7 项）✅
- [x] AI 工具在首页分类 Tab 中重复显示 → 添加 `.filter((t) => !t.isAi)`
- [x] image-upscaler 的 stale closure → 用 ref 替换依赖数组中的 state
- [x] background-removal 格式切换重新推理 → 缓存 RGBA 结果，Canvas 重新编码
- [x] 选择文件后拖放替换失效 → 用 DropTarget 包裹文件展示区
- [x] markdown-to-pdf 弹窗拦截 → 隐藏 iframe 打印
- [x] svg-to-png + image-resizer 硬编码英文 → 添加 t() 调用 + i18n 键
- [x] DropTarget 拖放视觉反馈 → 添加 bg-blue-50 高亮

### 本地收藏 + 最近使用 ✅
- [x] `useLocalStorage<T>` 通用 Hook
- [x] `useRecordToolUsage(slug)` 访问追踪 Hook
- [x] `FavoritesButton` 心形切换按钮（ToolCard + 工具页）
- [x] `FavoritesSection` / `RecentSection` 首页区块
- [x] Header 导航收藏夹链接
- [x] 中英文 i18n 键

### 工具间交叉推荐 ✅
- [x] `src/lib/recommendations/engine.ts` 规则引擎（同类别 +3，关键词重叠 +2，互补对 +5，搜索量层级 +1）
- [x] `SimilarTools` 服务端组件（工具页 FAQ 上方）
- [x] `AfterToolSuggestions` 客户端组件（工具操作完成后）
- [x] 中英文 i18n 键

### 性能优化 ✅
- [x] 修复 CSS 变量自我引用（`--font-sans` → `--font-geist-sans`）
- [x] 移除 layout head 中重复的 GA 内联脚本
- [x] `loading.tsx` 骨架屏 + `error.tsx` 错误边界
- [x] `@next/bundle-analyzer` 集成（`ANALYZE=true`）
- [x] 图片加 `width`/`height` 属性减少 CLS

### PWA 支持 ✅
- [x] `public/manifest.json` + SVG 图标（192/512）
- [x] `public/sw.js` 自定义 Service Worker（导航→网络优先，静态资源→缓存优先）
- [x] `public/offline/index.html` 离线回退页
- [x] `PwaRegister` 注册组件
- [x] 布局 meta 标签（theme-color、apple-mobile-web-app、manifest 链接）
- [x] next.config.ts SW/manifest 缓存头

### 邮件通讯 ✅
- [x] `NewsletterForm` 客户端组件（Mailchimp 嵌入表单）
- [x] `NewsletterSection` 条件展示（3+ 次访问 或 2+ 次使用，30 天内不重复）
- [x] 环境变量 `NEXT_PUBLIC_MAILCHIMP_URL` 配置
- [x] 中英文 i18n 键

### 新增文件（25 个）
| 文件 | 用途 |
|------|------|
| `src/hooks/use-local-storage.ts` | 通用 localStorage 封装 |
| `src/hooks/use-record-tool-usage.ts` | 工具访问追踪 |
| `src/components/layout/favorites-button.tsx` | 收藏心形按钮 |
| `src/components/layout/favorites-client.tsx` | 收藏区块 |
| `src/components/layout/recent-client.tsx` | 最近使用区块 |
| `src/lib/recommendations/engine.ts` | 推荐引擎 |
| `src/components/layout/similar-tools.tsx` | 相似工具组件 |
| `src/components/layout/after-tool-suggestions.tsx` | 操作后推荐 |
| `src/components/layout/newsletter-form.tsx` | 邮件订阅表单 |
| `src/components/layout/pwa-register.tsx` | SW 注册组件 |
| `src/app/[locale]/loading.tsx` | 加载骨架屏 |
| `src/app/[locale]/error.tsx` | 错误边界 |
| `public/manifest.json` | PWA 配置清单 |
| `public/sw.js` | Service Worker |
| `public/offline/index.html` | 离线回退页 |
| `public/icons/icon-192.svg` | PWA 图标 192×192 |
| `public/icons/icon-512.svg` | PWA 图标 512×512 |

### 工具总数：48 个

| 分类 | 数量 | 新增（本阶段） | 说明 |
|------|------|--------------|------|
| Image | 18 | +2 AI 工具 | 含背景移除、图片放大 |
| PDF | 8 | - | - |
| **Markdown** | **9** | **+4** | HTML→MD、格式化、MD→PDF、URL→MD |
| Dev | 8 | - | - |
| Calculator | 7 | - | - |

### 已完成的技术债清理

| 任务 | 说明 |
|------|------|
| FileUploadZone 提取 | 15 个组件共享拖放上传区域，减少 ~200 行重复代码 |
| AI Badge 系统 | `isAi` 字段 → ToolCard 紫色渐变标识 + 首页 AI 专区 |

### 新增 AI 工具

| # | 工具 | Slug | 技术栈 | 搜索量 |
|---|------|------|--------|--------|
| 1 | AI Background Remover | `remove-background` | `@imgly/background-removal` (ONNX/WASM) | ~2M/mo |
| 2 | AI Image Upscaler | `image-upscaler` | Canvas Lanczos + Unsharp Mask | ~300K/mo |

### 新增 Markdown 工具

| # | 工具 | Slug | 技术栈 | 搜索量 |
|---|------|------|--------|--------|
| 1 | HTML → Markdown | `html-to-markdown` | `turndown` (已有) | ~80K/mo |
| 2 | Markdown Formatter | `markdown-formatter` | 自研格式化引擎 | ~40K/mo |
| 3 | Markdown → PDF | `markdown-to-pdf` | `marked` + 浏览器打印 | ~100K/mo |
| 4 | URL → Markdown | `url-to-markdown` | `fetch` + `turndown` | ~60K/mo |

---

## 待执行任务

### 立即修复（代码审查发现）

- [ ] 修复 image-upscaler scale/format 按钮的 stale closure 问题
- [ ] 修复 background-removal format 切换不重新处理的问题
- [ ] 修复 FileUploadZone 在单文件工具中丢失拖拽替换行为
- [ ] 修复 markdown-to-pdf popup blocker 无反馈问题
- [ ] 修复 AI 工具在首页的重复渲染问题
- [ ] 修复 svg-to-png 硬编码英文问题
- [ ] 修复 image-resizer 拖放视觉反馈丢失问题

### 下一阶段：阶段 4（用户留存与增长循环）

1. **本地收藏夹** — localStorage 收藏 + 最近使用
2. **工具间交叉推荐** — 同类工具互补推荐
3. **邮件通讯** — Mailchimp 集成
4. **PWA 支持** — Service Worker + 离线缓存
5. **性能优化** — Lighthouse 95+ 目标

### 后续：阶段 5（规模加速）

- 工具数量目标：60+
- Calculator 和 Dev 品类补充轻量工具
- 竞品对比内容矩阵（10 篇博客）
- 品牌建设

---

## 已建立的基础设施

| 组件/模块 | 用途 | 使用者数量 |
|-----------|------|-----------|
| `FileUploadZone` | 拖放文件上传区 | 15+ 工具 |
| `ToolShell` | 输入/输出面板布局 | 图片转换等 |
| `ToolCard` | 首页工具卡片（含 AI Badge） | 首页 + 子域名 |
| `AdUnit` | Google AdSense 广告单元 | 首页 + 工具页 |
| `formatFileSize` | 文件大小格式化 | 全局 |
| `useClipboard` | 剪贴板操作 Hook | 文本工具 |
| `isImageFile` | 图片文件类型校验 | 图片工具 |

---

## 收入与流量

| 指标 | 当前 | 阶段 3 目标 |
|------|------|------------|
| 工具数 | 48 | 40+ ✅ |
| AI 工具 | 2 | 2 ✅ |
| 日 PV | 待 GA 数据 | > 3,000 |
| 月收入 | 待 AdSense 数据 | > $300 |

---

## 关键技术决策记录

1. **AI 模型客户端运行** — 隐私优先（不上传服务器）是核心差异化
2. **FileUploadZone onFiles 接口** — 统一为 `File[]`（单文件取 `files[0]`）
3. **i18n 策略** — 每个工具独立命名空间（非共享），便于独立定制
4. **图片放大不用 Transformers.js** — Canvas 原生插值更快更稳定
5. **URL→Markdown 无服务端代理** — 受 CORS 限制，提供 HTML 粘贴备选路径
