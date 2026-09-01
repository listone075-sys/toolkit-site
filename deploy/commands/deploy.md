# 部署命令

> 最后更新：2026-07-29

## 自动部署（默认，推荐）

`git push origin main` 后无需手动操作。服务器 `systemd timer` 每 2 分钟触发一次：

```
git push → GitHub → 最多 2 分钟 → 服务器自动拉取构建重启
```

**机制：**

| 组件 | 说明 |
|------|------|
| `toolkit-deploy.timer` | 每 2 分钟触发一次（OnUnitActiveSec=120） |
| `toolkit-deploy.service` | oneshot 服务，执行部署脚本 |
| `/opt/toolkit_site/scripts/auto-deploy.sh` | 部署脚本 |
| `/var/log/toolkit-deploy.log` | 部署日志（保留最近 5000 行） |

**监控：**

```bash
# 部署日志
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'tail -f /var/log/toolkit-deploy.log'

# 定时器状态
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl status toolkit-deploy.timer --no-pager'

# 手动触发
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl start toolkit-deploy.service'
```

**暂停/恢复：**

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl stop toolkit-deploy.timer'    # 暂停
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl start toolkit-deploy.timer'   # 恢复
```

## 手动部署（备选）

SSH 到服务器手动执行：

```bash
git push origin main && ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'cd /opt/toolkit_site && git stash && git pull && npm install --legacy-peer-deps && npm run build && systemctl restart toolkit-site'
```

## 仅重启（代码未变）

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl restart toolkit-site'
```

## 状态检查

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl status toolkit-site --no-pager --lines=3'
```
