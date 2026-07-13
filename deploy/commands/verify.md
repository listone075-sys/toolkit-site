# 部署后验证

> 最后更新：2026-07-10

## 快速检查（HTTP 状态码）

```bash
# 主站首页
curl -s -o /dev/null -w "%{http_code}" https://toolcraftbox.com/en

# 中文工具页
curl -s -o /dev/null -w "%{http_code}" https://toolcraftbox.com/zh/tools/markdown-editor

# 子域名
curl -s -o /dev/null -w "%{http_code}" https://image.toolcraftbox.com/en
curl -s -o /dev/null -w "%{http_code}" https://pdf.toolcraftbox.com/en
curl -s -o /dev/null -w "%{http_code}" https://markdown.toolcraftbox.com/en
curl -s -o /dev/null -w "%{http_code}" https://dev.toolcraftbox.com/en
```

全部应返回 `200`。

## 服务状态

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl status toolkit-site --no-pager'
```

应显示 `active (running)`。

## 构建日志（如有异常）

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'journalctl -u toolkit-site --no-pager -n 50'
```

## 磁盘空间

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'df -h /opt'
```
