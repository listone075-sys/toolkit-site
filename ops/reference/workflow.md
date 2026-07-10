# 运营工作流

## 每日

- 发布 1 条 Twitter 推文（从内容库取或新写）
- 检查 GSC 数据（索引状态、搜索查询）
- Pinterest 互动（浏览、Pin、关注）— 养号期间

## 每周节奏

| 日 | 任务 |
|:--:|------|
| 周一 | 本周内容选题 + 开始写第1篇博客 |
| 周二 | 第1篇博客发布 + 写第2篇 |
| 周三 | 第2篇博客发布 + 写第3篇 |
| 周四 | 第3篇博客发布 + 写第4篇 |
| 周五 | 本周复盘 + 下周规划 |

## 博客发布 SOP

1. 写 EN 版本 → 写 ZH 版本
2. `git add` → `git commit` → `git push`
3. SSH 部署
4. 写 Twitter 推文 + Pinterest Pin 描述
5. 手动发布社交内容
6. 更新 `tracking/blog-progress.md` 和 `tracking/social-media.md`

## 每篇博客发布后必做

1. ✅ 写 Twitter 推文
2. ✅ 写 Pinterest Pin 描述（含标题、描述、目标Board）
3. ✅ IndexNow 自动提交（postbuild 已配置）
4. ✅ 在主站博客列表确认可访问

## 部署

```bash
# 一键部署
git push && ssh root@124.156.154.129 "cd /opt/toolkit_site && git pull && npm run build && systemctl restart toolkit-site"
```

- 服务器：124.156.154.129 (root)，香港 VPS
- 项目路径：`/opt/toolkit_site`
- 服务：`systemctl restart toolkit-site` (端口 8001)
