# 部署命令

> 最后更新：2026-07-10

## 一键部署（推荐）

代码推送 + 服务器拉取 + 安装依赖 + 构建 + 重启：

```bash
git push origin main && ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'cd /opt/toolkit_site && git stash && git pull && npm install --legacy-peer-deps && npm run build && systemctl restart toolkit-site'
```

## 仅重启（代码未变）

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl restart toolkit-site'
```

## 部署后验证

```bash
# 主站
curl -s -o /dev/null -w "%{http_code}" https://toolcraftbox.com/en

# 工具页
curl -s -o /dev/null -w "%{http_code}" https://toolcraftbox.com/zh/tools/markdown-editor
```

两个都应返回 `200`。

## 状态检查

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl status toolkit-site --no-pager --lines=3'
```
