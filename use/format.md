# site.yaml

`config/site.yaml` 控制整个站点的外观和基本信息。

## 关键参数

- `site_name`: 站点名称。
- `site_short_name`: 站点的短名称。
- `site_description`: 站点描述。
- `site_url`: 站点的正式访问域名。
- `organization_name`: 所属的高校或单位名称。

## 图标配置

- `logo_light`: 浅色模式下的 Logo。
- `logo_dark`: 深色模式下的 Logo。
- `favicon`: 站点图标。

## 页脚信息

- `copyright`: 版权声明。

```yaml
# 示例 site.yaml
site_name: "EDU Publish"
site_short_name: "EDU Publish"
site_description: "高校通知聚合站"
site_url: "https://edu-publish.site"
organization_name: "示例大学"
```

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

# 功能开关 (widgets.yaml)

`config/widgets.yaml` 控制站点的各种增强功能和 UI 挂件，分为两层：

## modules（顶层模块开关）

布尔值，控制整个模块是否渲染：

```yaml
modules:
  dashboard: true       # 数据看板
  right_sidebar: true   # 右侧边栏
  search: true          # 搜索
  view_counts: true     # 浏览量
  rss_entry: true       # RSS 入口
  pwa_install: true     # PWA 安装提示
  stats_chart: true     # 统计图表
  footer_branding: true # 页脚品牌
  update_health: false  # 更新健康度
```

## widgets（组件细粒度配置）

各组件的标题、默认状态等参数：

```yaml
widgets:
  calendar:
    enabled: true
    title: "日期筛选"
    default_expanded: true
  search:
    placeholder: "搜索通知标题、内容…"
    show_hit_count: true
  ai_summary:
    enabled: true
    title: "今日摘要"
    empty_text: "暂无今日摘要"
  view_counts:
    enabled: true
    label: "阅读量"
  palette_switcher:
    enabled: true
```

# 卡片的 Markdown 格式

每张通知卡片是一个带 YAML frontmatter 的 Markdown 文件，位于 `content/card/<school_slug>/` 目录下：

```yaml
---
id: unique-notification-id
school_slug: info-engineering
title: 关于 2026 年暑期实习报名的通知
description: >-
  信息工程学院发布暑期实习报名通知，截止日期为 5 月 20 日，
  需在教务系统提交申请表。
published: 2026-04-13T08:00:00+08:00
category: 通知公告
tags:
  - 实习
  - 报名
source:
  channel: 信工学院通知群
  sender: 辅导员张老师
attachments:
  - name: 报名表.docx
    url: /attachments/info-engineering/signup-form.docx
---

通知正文内容...
```

::: info 关键字段规则
- `description` 使用 YAML `>-` 折叠语法，50-70 字符
- `published` 必须为 ISO 8601 格式，带 `+08:00` 时区
- `category` 必须是 `subscriptions.yaml` 中定义的分类之一
- `tags` 最多 5 个
:::