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
site_url: "https://example.edu.cn"
organization_name: "示例大学"
```

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

# 功能开关 (widgets.yaml)

`config/widgets.yaml` 控制站点的各种增强功能和 UI 挂件。

## 关键参数

- `show_search`: 是否显示搜索框。
- `show_filter`: 是否显示筛选器。
- `show_calendar`: 是否启用日历视图。
- `show_summary`: 是否显示 AI 摘要。

## 功能配置

- `show_footer`: 是否显示页脚。
- `show_dark_mode`: 是否支持暗色模式切换。

```yaml
# 示例 widgets.yaml
show_search: true
show_filter: true
show_calendar: true
show_summary: true
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