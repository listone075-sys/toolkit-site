# Deploy CLI

ToolCraft 项目运维专用目录。在此目录运行 `claude` 进入运维会话。

> 主项目：`D:\ai\toolkit-site`
> 运营：`../ops`（内容、追踪、社交媒体）

## 快速索引

| 想看什么 | 文件 |
|---------|------|
| **服务器连接 + 域名** | `server/info.md` |
| **Nginx 配置** | `server/nginx.md` |
| **常见问题排查** | `server/troubleshooting.md` |
| **部署命令** | `commands/deploy.md` |
| **部署后验证** | `commands/verify.md` |

## 一键部署

```bash
git push origin main && ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'cd /opt/toolkit_site && git stash && git pull && npm install --legacy-peer-deps && npm run build && systemctl restart toolkit-site'
```

## 常用运维

```bash
# 仅重启
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl restart toolkit-site'

# 状态检查
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl status toolkit-site --no-pager --lines=3'

# 查看日志
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'journalctl -u toolkit-site -f --no-pager -n 50'

# 部署后验证
curl -s -o /dev/null -w "%{http_code}" https://toolcraftbox.com/en
curl -s -o /dev/null -w "%{http_code}" https://toolcraftbox.com/zh/tools/markdown-editor
```
