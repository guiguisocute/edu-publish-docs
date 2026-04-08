# 步骤1：消息桥接

消息桥接阶段负责将 QQ 群消息落盘到本地 `archive/` 目录。

## 核心组件

- **NapCat**: QQ 协议层，负责收发消息。
- **EDU-PUBLISH + 归档插件**: 接收消息，并按日期写入 `archive/YYYY-MM-DD/messages.md`。

## 部署流程

推荐使用 Docker 容器化运行两个服务：

1. **容器 1 (NapCat)**: 登录 QQ 账号并启用消息转发。
2. **容器 2 (EDU-PUBLISH)**: 安装 `edu-publish-QQtoLocal` 插件。
3. **配置互通**: 两个容器通过 Docker 网络互通，将消息实时传输并写入宿主机的挂载目录。

## 目录结构

```text
archive/
  └── 2026-04-06/
      └── messages.md  # 原始消息记录
```

::: info
`archive/` 目录是一个独立的 Git submodule，方便内容生产阶段独立读取和推送。
:::
