# 部署命令

> 最后更新：2026-07-29

## 自动部署（默认，推荐）

`git push origin main` 后无需手动操作。服务器 `systemd timer` 每 2 分钟触发一次：

```
git push → GitHub → 最多 2 分钟 → 服务器自动拉取构建重启
```

**机制（standalone + 原子切换，2026-09-02 起）：**

| 组件 | 说明 |
|------|------|
| `toolkit-deploy.timer` | 每 2 分钟触发一次（OnUnitActiveSec=120） |
| `toolkit-deploy.service` | oneshot 服务，执行部署脚本 |
| `/opt/toolkit_site/deploy/scripts/auto-deploy.sh` | 部署脚本（**唯一源头**，`scripts/auto-deploy.sh` 是其符号链接） |
| `/var/log/toolkit-deploy.log` | 部署日志（保留最近 5000 行） |

**部署架构（消除构建窗口期 500）：**

```
npm run build (output: standalone)
  → 复制 .next/standalone + .next/static + public 到 releases/<commit>-<ts>/
  → ln -sfn 原子切换 current → releases/<新版本>/
  → systemctl restart（node current/server.js）
  → 清理旧 release（保留最近 5 个）
```

- 旧 release 目录在构建期间**原封不动**，旧进程照常服务 → 无 500 窗口。
- 停机窗口从「分钟级构建」缩到「秒级重启」。
- 回滚 = 把 `current` 指回上一个 release 再 `systemctl restart toolkit-site`。

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

SSH 到服务器手动执行（等价于 timer 触发）：

```bash
git push origin main && ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl start toolkit-deploy.service'
```

## 回滚

```bash
# 1. 查看当前 release 列表
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'ls -1 /opt/toolkit_site/releases/'

# 2. 把 current 指回上一个 release，并重启
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'ln -sfn /opt/toolkit_site/releases/<旧release> /opt/toolkit_site/current.new && mv -Tf /opt/toolkit_site/current.new /opt/toolkit_site/current && systemctl restart toolkit-site'
```

## 仅重启（代码未变）

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl restart toolkit-site'
```

## 状态检查

```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'systemctl status toolkit-site --no-pager --lines=3'
```
