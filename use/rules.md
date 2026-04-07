# 自定义规则

AstrBot 支持通过简单的 YAML 或 JavaScript 定义自定义处理逻辑。

## 什么是自定义规则

您可以定义：
- **关键词拦截**: 当用户发送敏感词时，自动回复预警或屏蔽。
- **自定义指令别名**: 比如将 `/h` 映射为 `/help`。
- **特定消息转发**: 将某个群组的消息自动转发到另一个群组。

## 规则语法

您可以在 WebUI 的“规则管理”中直接编写和调试规则脚本。

```javascript
export default {
  match: (event) => event.content.includes("测试"),
  handle: (event) => "收到测试请求！"
}
```
