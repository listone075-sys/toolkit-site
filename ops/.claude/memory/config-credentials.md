---
name: config-credentials
description: 第三方平台 API Key、ID、Token 等配置凭据
metadata:
  type: reference
---

## SEO & 索引

### IndexNow
- **Key**: `8a2504e05676408ab4d62c2c9550f212`
- **验证 URL**: `https://toolcraftbox.com/8a2504e05676408ab4d62c2c9550f212.txt`
- **API URL**: `https://api.indexnow.org/indexnow`
- **服务器配置**:
  - `/opt/toolkit_site/.env.local` 中有 `INDEXNOW_KEY`
  - systemd service 中也有 `Environment=INDEXNOW_KEY=...`
  - middleware 自动处理 `/{key}.txt` 验证
  - postbuild 自动提交 17 个关键 URL

### Bing Webmaster
- 已验证 ✅ (6/26)

### Ahrefs Webmaster
- ⬜ 待注册

## 流量分析

### Google Analytics 4
- **Measurement ID**: `G-0EHKDP008P`（前端）
- **Property ID**: `541266486`（API 查询用）
- **API 模式**: ✅ 服务账号已配置
- **服务账号**: `openclaw-read-ga4@website-statistics-query.iam.gserviceaccount.com`
- **Key 文件**: `cankao/website-statistics-query-c026cb5646a9.json`（已加入 `.gitignore`）
- **API**: Google Analytics Data API v1
- **获取命令**: `npx tsx scripts/ga4-fetch.ts`
- **输出路径**: `ops/tracking/daily-stats/`

### Google Search Console
- 已验证 ✅
- GSC 数据目前需手动查看

## 广告

### Google AdSense
- **代码**: `ca-pub-5142105226310650`

## 社交媒体

### Twitter/X
- **账号**: @ToolCraftBox
- 头像/封面: `public/social/twitter-avatar.png` / `public/social/twitter-cover.png`

### Pinterest
- **账号**: toolcraftbox
- ⚠️ 个人账号，商业账号转换待重试

**Why:** 避免每次重新查找 Key/ID/凭据，集中管理所有第三方配置。
**How to apply:** 新增第三方服务时更新此文件，查找凭据优先查此文件。
