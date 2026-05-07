# 常见问题

## 基础概念

### EDU-PUBLISH 和 AstrBot 是什么关系？

EDU-PUBLISH 的消息桥接阶段依赖 **AstrBot** 作为机器人框架，搭配 `astrbot-QQtoLocal` 插件将 QQ 群消息自动归档到本地。AstrBot 负责消息的接收和协议转换，EDU-PUBLISH 负责后续的内容生产和站点展示。

### 必须使用 QQ 群作为消息源吗？

目前插件仅支持 QQ 群作为消息源（通过 NapCat 协议层）。但由于三段式架构解耦，消息桥接阶段可以替换为任何能将消息写入 `archive/` 目录的方案。

### 支持哪些 AI Agent？

理论上支持任何能阅读文件并执行 Git 操作的 AI Agent，包括但不限于：
- **Claude Code** — Anthropic 官方 CLI
- **OpenCode** — 开源终端 Agent
- **Codex** — OpenAI CLI Agent
- **OpenClaw** — 开源 Agent 工具

### `archive/` 是什么？

`archive/` 是一个 Git 子模块，用于存储 QQ 群消息的原始记录。目录按日期组织（`archive/YYYY-MM-DD/messages.md`），对 Agent 只读。它独立于主仓库管理，可以单独备份和版本控制。

## 部署相关

### 部署需要服务器吗？

| 阶段 | 是否需要服务器 | 说明 |
| :--- | :--- | :--- |
| 消息桥接 | 否 | 需运行 Docker（NapCat + AstrBot），可以是本地机器或云服务器，但云服务器更好 |
| Agent 内容生产 | 否 | 在本地运行 Agent 即可 |
| 站点部署 | 否 | 使用 Cloudflare Pages 等免费静态托管 |

### 有哪些部署方式？

| 方式 | 适用场景 |
| :--- | :--- |
| [Cloudflare Pages Git 直连](/intro/deploy-agent) | 推荐，零 CI 配置，连接仓库即可 |
| [GitHub Actions + Wrangler](/intro/deploy-actions) | 需要自定义 CI 流程（S3 上传、内容快照等） |
| [手动部署](/intro/deploy-manual) | 部署到 Vercel / Netlify / GitHub Pages / 自有服务器 |
| Agent 引导部署 | 从零开始，让 Agent 读取 `.agent/SETUP.md` 自动完成全部搭建 |

### Cloudflare Pages 免费额度够用吗？

对于绝大多数高校场景完全足够。Cloudflare Pages 免费版提供：
- 每月 500 次构建
- 无限带宽
- 无限请求数

### `docker-compose.yml` 在哪里？

仓库中**不包含** `docker-compose.yml`。它由 Agent 在执行 `.agent/SETUP.md` 部署流程时自动生成，内容包括 NapCat 和 AstrBot 两个服务的容器配置。

## 配置相关

### 配置文件在哪里？

项目的配置集中在 `config/` 目录下的三个 YAML 文件：

| 文件 | 用途 |
| :--- | :--- |
| `site.yaml` | 站点基础信息：名称、URL、LOGO、页脚、SEO、调色板预设、`github_actions_enabled` 开关 |
| `subscriptions.yaml` | 通知分类列表 + 学院/部门定义（slug、名称、图标、排序、订阅源） |
| `widgets.yaml` | 模块开关（`modules`）与组件配置（`widgets`）两层结构 |

> 详细参数说明请参阅 [配置参考](/use/format)。

### 如何开启/关闭某个功能？

`config/widgets.yaml` 分为两层：

**`modules`** — 顶层模块开关（布尔值）：
```yaml
modules:
  dashboard: true
  right_sidebar: true
  search: true
  view_counts: true
  rss_entry: true
  pwa_install: true
  stats_chart: true
```

**`widgets`** — 各组件的细粒度配置：
```yaml
widgets:
  calendar:
    enabled: true
    title: "日期筛选"
    default_expanded: true
  ai_summary:
    enabled: true
    title: "今日摘要"
  view_counts:
    enabled: true
    label: "阅读量"
  palette_switcher:
    enabled: true
```

### 环境变量怎么配置？

参考项目根目录的 `.env.example`：

```bash
SITE_URL=https://example.edu.cn

# S3 兼容存储（可选）
S3_BUCKET=
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_BASE_URL=
ATTACHMENT_UPLOAD_THRESHOLD_MB=20

# Cloudflare Pages（可选，wrangler CLI 使用）
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_PROJECT_NAME=

# 浏览量统计（可选）
VIEW_COUNT_BACKEND=none   # none | d1
CF_D1_DATABASE_ID=

# 消息桥接（可选）
NAPCAT_ACCOUNT=
ASTRBOT_DASHBOARD_PORT=6185
```

## 内容生产

### Agent 会修改项目代码吗？

不会。Agent 的写入范围受 `BOT_RULES.md` 严格约束，仅限 `content/**/*.md` 和 `worklog/**/*.md`。禁止修改配置文件、代码和归档数据。

### Agent 推送到哪个分支？

Agent 只推送到 **`test` 分支**，不允许直接推送到 `main`。生产部署通过 PR 合并流程完成。

### 卡片的 Markdown 格式是什么样的？

请参阅 [卡片的 Markdown 格式](/use/format)。


### Agent 有哪些技能？

Agent 内容生产依赖 `EDU-PUBLISH-skills` 仓库中的 8 个标准技能，通过 git sparse checkout 安装到 `./skills/` 目录：

| 技能 | 职责 |
| :--- | :--- |
| `edup-reconcile` | 对账：确认待处理日期 |
| `edup-incremental-process` | 增量处理：跳过已处理的归档 |
| `edup-map-source` | 来源映射：群消息 → school_slug |
| `edup-merge-supplement` | 合并补充：处理消息的补充/更正 |
| `edup-parse-and-create-cards` | 解析与建卡：两阶段卡片生成 |
| `edup-validate-and-push` | 校验与推送：`pnpm run validate` 后推送 |
| `edup-write-conclusion` | 编写摘要：每日通知摘要 |
| `edup-write-worklog` | 工作日志：处理统计报告 |
