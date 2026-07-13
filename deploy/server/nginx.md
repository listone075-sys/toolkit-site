# Nginx 配置

> 最后更新：2026-07-10

## 配置文件

| 文件 | 用途 |
|------|------|
| `/etc/nginx/conf.d/toolcraftbox-subdomains.conf` | 主站点配置（含所有子域名） |
| `/etc/nginx/nginx.conf` | Nginx 主配置 |

## 重载

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'nginx -t && systemctl reload nginx'
```

## 子域名代理逻辑

所有子域名统一代理到 `localhost:8001`，通过 `X-Subdomain` 请求头传递子域名信息：

```
toolcraftbox.com        → localhost:8001  (X-Subdomain: 空/主站)
image.toolcraftbox.com  → localhost:8001  (X-Subdomain: image)
pdf.toolcraftbox.com    → localhost:8001  (X-Subdomain: pdf)
markdown.toolcraftbox.com → localhost:8001 (X-Subdomain: markdown)
dev.toolcraftbox.com    → localhost:8001  (X-Subdomain: dev)
```

Next.js 端通过 `headers()` 读取 `Host` 头，检测子域名并渲染对应分类页面。

## SSL

Let's Encrypt 自动管理，证书路径：
- `/etc/letsencrypt/live/toolcraftbox.com/`
