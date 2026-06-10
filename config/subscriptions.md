# 订阅源 (subscriptions.yaml)

`config/subscriptions.yaml` 决定站点的导航结构与通知分类，分为三层：顶层 `categories`（分类枚举）、`schools`（学院/单位，一级层级）、每个 school 下的 `subscriptions`（订阅源，二级层级）。

## categories（分类枚举）

字符串数组。Agent 生成卡片时 `category` 字段必须从中选取，**数组末尾项为兜底值**（无法判断归属时使用）。

## schools（一级层级）

- `slug`: 唯一标识符，用于卡片目录名（`content/card/<slug>/`）与 RSS 路径，**不能含中文和空格**。
- `name` / `short_name`: 全称与简称。
- `order`: 排序权重。
- `icon`: 图标路径（如 `/img/xxx.svg`）。
- `subscriptions`: 该学院下的订阅源列表，**不能为空**。

## subscriptions（二级层级）

- `title`: 订阅源名称，用于与归档消息中的「来源群」名称匹配。
- `number`（可选）: QQ 群号，用于同名群消歧，不参与前端展示。
- `enabled` / `order` / `icon` / `url`: 启用开关、排序、图标与外链。

```yaml
# 示例 subscriptions.yaml
categories:
  - 通知公告
  - 竞赛相关
  - 其它分类   # 末尾项为兜底分类

schools:
  - slug: info-engineering
    name: 信息工程学院
    short_name: 信工
    order: 1
    icon: /img/unit-icon-info-engineering.svg
    subscriptions:
      - title: 学院通知
        number: "123456789"   # 可选：对应 QQ 群号，用于消歧
        enabled: true
        order: 1
        icon: /img/unit-icon-info-engineering.svg
```

::: warning 编译约束
`schools` 必须为非空数组，且每个 school 至少有 1 条订阅，否则 `pnpm run build` 直接失败。编译器会为每个学院自动补一条「未知来源」兜底订阅，无内容时前端会自动隐藏。
:::
