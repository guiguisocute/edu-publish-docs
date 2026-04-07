# 插件管理

本章介绍 AstrBot 的插件管理系统，包括插件的安装、卸载和重载。

## SubAgent 编排

支持多代理协同工作，通过图形化界面进行编排。

### 编排流程

1. **创建工作流**: 在管理面板中新建一个编排。
2. **添加代理**: 从已安装的代理列表中选择。
3. **连接节点**: 配置各代理之间的输入输出。

## 自定义规则

支持通过 JavaScript 编写自定义处理规则。

### 规则示例

```javascript
export default {
  handle(event) {
    if (event.content.includes("Hello")) {
      return "Hi there!";
    }
  }
}
```

::: info
更多自定义规则示例请参考我们的 [API 文档](../dev/api)。
:::
