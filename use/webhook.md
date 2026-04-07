# 统一 Webhook 模式

统一 Webhook 模式让您可以将 AstrBot 与各种外部服务进行低门槛集成。

## 什么是 Webhook

Webhook 模式允许：
- **消息推送**: 将机器人的回复推送到您的 Web 服务。
- **消息接收**: 让您的 Web 服务向机器人发送消息指令。
- **平台透明化**: 无论是 QQ、微信还是飞书，都可以通过统一的 Webhook 接口进行操作。

## 配置 Webhook

在 WebUI 的 **适配器配置** 页面，您可以设置：
- Webhook URL
- API Key (用于鉴权)
- 推送事件过滤。

::: tip
Webhook 模式是与其他企业级应用（如钉钉、Slack）集成的首选。
:::
