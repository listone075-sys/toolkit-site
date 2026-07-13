# 服务器信息

> 最后更新：2026-07-10

## 连接

| 项 | 值 |
|----|-----|
| SSH | `ssh -i ~/.ssh/id_ed25519 root@124.156.154.129` |
| 主机 | 124.156.154.129（香港 VPS） |
| 用户 | root |
| 密钥 | ~/.ssh/id_ed25519 |

## 应用

| 项 | 值 |
|----|-----|
| 项目路径 | `/opt/toolkit_site` |
| 服务名 | `toolkit-site` (systemd) |
| 端口 | 8001 (Next.js) |
| Node 包管理器 | npm（必须加 `--legacy-peer-deps`） |

## 常用运维命令

```bash
# 查看服务状态
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl status toolkit-site --no-pager'

# 查看日志（实时）
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'journalctl -u toolkit-site -f --no-pager -n 50'

# 仅重启服务（代码未变）
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl restart toolkit-site'

# 重载 Nginx
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'nginx -t && systemctl reload nginx'
```

## 域名架构

所有子域名通过 Nginx 反向代理到 `:8001`，携带 `X-Subdomain` 头：

| 域名 | 用途 |
|------|------|
| `toolcraftbox.com` | 主站（全部工具） |
| `image.toolcraftbox.com` | 图片工具 |
| `pdf.toolcraftbox.com` | PDF 工具 |
| `markdown.toolcraftbox.com` | Markdown 工具 |
| `dev.toolcraftbox.com` | 开发者工具 |
