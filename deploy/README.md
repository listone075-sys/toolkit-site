# Deploy — ToolCraft 项目运维目录

> 在此目录运行 `claude` 进入运维会话，CLAUDE.md 自动加载。
>
> 运营相关工作（内容、追踪、社交媒体）在 `../ops`。

## 目录结构

```
deploy/
├── CLAUDE.md                 会话入口（自动加载：服务器、部署命令）
├── README.md                 本文件
│
├── server/                   服务器与基础设施
│   ├── info.md               SSH、IP、域名、systemd 服务
│   ├── nginx.md              Nginx 配置 + 子域名代理逻辑
│   └── troubleshooting.md    常见问题排查（onnxruntime-web 等）
│
└── commands/                 命令速查
    ├── deploy.md             部署命令（一键/仅重启/验证）
    └── verify.md             部署后验证清单
```

## 使用方式

```bash
cd deploy
claude
# CLAUDE.md 自动加载 → 服务器信息 + 部署命令一目了然
```
