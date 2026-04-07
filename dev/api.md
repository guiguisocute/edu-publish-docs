# 插件开发指南

本章详细列出了 AstrBot 插件开发的常用 API 和开发规范。

## 消息事件 API

`AstrMessageEvent` 是消息传递的核心对象，包含了消息的所有元数据。

### 获取消息内容

```python
event.message_str  # 获取消息的纯文本内容
event.get_sender_name()  # 获取发送者名称
event.get_group_id()  # 获取群组 ID
```

### 回复消息

```python
yield event.plain_result("回复内容")  # 发送一条纯文本消息
yield event.image_result("https://example.com/image.jpg")  # 发送一张图片
```

## 平台适配器 API

平台适配器通过 `Context` 对象进行访问。

### 访问上下文

```python
context.get_platform_manager()  # 获取平台管理器
context.get_provider_manager()  # 获取提供商管理器
```

::: warning
API 参考仍在持续更新中，请以源代码为准。
:::
