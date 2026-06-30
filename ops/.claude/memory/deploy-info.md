---
name: deploy-info
description: toolcraftbox.com 服务器 SSH、nginx、部署命令
metadata:
  type: reference
---

## SSH 连接

- **Host**: 124.156.154.129
- **用户**: root
- **端口**: 22
- **密钥**: ~/.ssh/id_ed25519

## 部署

- 项目路径: `/opt/toolkit_site`
- 服务: `systemctl restart toolkit-site`（端口 8001）
- Nginx: `/etc/nginx/conf.d/toolcraftbox-subdomains.conf` → proxy_pass `http://127.0.0.1:8001`

## 一键部署命令

```bash
git push && ssh root@124.156.154.129 "cd /opt/toolkit_site && git pull && npm run build && systemctl restart toolkit-site"
```

## 端口分配

- `:8000` — stock_app（股票应用）
- `:8001` — Next.js（ToolCraft）

## SSL

- Let's Encrypt，路径: `/etc/letsencrypt/live/toolcraftbox.com/`
- 覆盖: `toolcraftbox.com`, `www.toolcraftbox.com`, `dev./image./pdf./markdown.toolcraftbox.com`

**Why:** 每次发布博客或更新网站都需要部署到服务器，SSH 别名可能不可用（Windows），直接使用 IP。
**How to apply:** 博客提交推送后运行部署命令，确认 `systemctl status toolkit-site` 显示 active。
