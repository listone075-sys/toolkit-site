---
name: deploy-info
description: toolcraftbox.com 服务器 SSH、nginx、部署命令 → 已迁移至 deploy/
metadata:
  type: reference
---

## 运维入口已迁移

所有运维内容已统一到 `deploy/` 目录。详见：
- `deploy/server/info.md` — 服务器连接 + 域名
- `deploy/server/nginx.md` — Nginx 配置
- `deploy/server/troubleshooting.md` — 常见问题
- `deploy/commands/deploy.md` — 部署命令
- `deploy/commands/verify.md` — 部署后验证

## 一键部署

```bash
git push origin main && ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'cd /opt/toolkit_site && git stash && git pull && npm install --legacy-peer-deps && npm run build && systemctl restart toolkit-site'
```

**Why:** 2026-07-10 将 deploy/ 和 ops/ 合并为统一运维目录，按域分层。
**How to apply:** 使用 `deploy/` 作为唯一运维入口，`cd deploy && claude`。
