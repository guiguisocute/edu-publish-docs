# 订阅源 (subscriptions.yaml)

`config/subscriptions.yaml` 用于定义需要监听和聚合的消息来源。

## 关键参数

- `name`: 订阅源名称（如“学工部”、“教务处”）。
- `slug`: 唯一标识符，用于目录名。
- `icon`: 在 UI 中显示的图标。
- `description`: 订阅源的简要描述。

## 监听配置

- `target`: 监听的 QQ 群号或外部接口。
- `filter`: 消息过滤规则，防止非通知类消息干扰。

```yaml
# 示例 subscriptions.yaml
- name: "教务处通知"
  slug: "jwc"
  icon: "school"
  description: "全校教务教学通知聚合"
  target: "123456789"  # 示例群号
```
