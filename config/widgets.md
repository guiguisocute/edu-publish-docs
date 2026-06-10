# 功能开关 (widgets.yaml)

`config/widgets.yaml` 控制站点的各种增强功能和 UI 挂件，分为两层结构。

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
  dashboard:
    title: "数据看板"
    visible_cards:
      - total_notices
      - today_notices
      - active_events
      - subscription_count
  ai_summary:
    enabled: true
    title: "今日摘要"
    empty_text: "暂无今日摘要"
    default_expanded: true
  time_filter:
    default_timed_only: false
    default_hide_expired: false
  tag_stats:
    max_display: 20
    default_expanded_count: 10
  view_counts:
    enabled: true
    label: "阅读量"
  rss_entry:
    enabled: true
    label: "RSS 订阅"
  pwa_install:
    enabled: true
    label: "安装应用"
    prompt_text: "将本站添加到主屏幕"
  palette_switcher:
    enabled: true
```

::: warning 修改后需重新编译
`widgets.yaml` 在构建前由 `scripts/compile-widgets-config.mjs` 编译为 JSON，Vite 不会热更新。修改后重跑 `pnpm run compile:config` 或重启 `pnpm run dev`。
:::
