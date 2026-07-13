# 常见问题

> 最后更新：2026-07-10

## onnxruntime-web 缺失导致构建失败

**现象：** `npm run build` 报错找不到 `onnxruntime-web` 模块。

**原因：** `@imgly/background-removal` 依赖 `onnxruntime-web`，npm 可能未正确 hoist。

**修复：** 已在 `package.json` 中直接声明 `onnxruntime-web@1.21.0`，正常 `npm install --legacy-peer-deps` 即可。

**备用方案（仅部署旧提交时需要）：**
```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'cd /opt/toolkit_site && npm install onnxruntime-web --legacy-peer-deps'
```

## 服务器有未提交的本地修改导致 git pull 失败

**修复：** 部署命令中已包含 `git stash`，正常情况不会遇到。如仍失败：
```bash
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'cd /opt/toolkit_site && git stash && git pull'
```

## npm install 报 peer dependency 冲突

**修复：** 始终使用 `--legacy-peer-deps`：
```bash
npm install --legacy-peer-deps
```

## 服务启动失败但构建成功

```bash
# 查看详细日志
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'journalctl -u toolkit-site --no-pager -n 100'

# 手动启动测试
ssh -i ~/.ssh/id_ed25519 root@124.156.154.129 'cd /opt/toolkit_site && npm run start'
```
