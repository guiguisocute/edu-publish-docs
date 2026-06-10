# 开发环境准备

本章面向想要**修改前端代码、构建脚本或参与贡献**的开发者。如果你只是想部署使用，请阅读[手动部署](/intro/deploy-manual)；如果你想了解 Agent 的内容生产规则，请阅读[使用说明书](/use/use)与仓库根目录的 `BOT_RULES.md`。

## 环境要求

| 工具 | 版本 | 说明 |
| :--- | :--- | :--- |
| Node.js | `>= 22` | `package.json` 的 `engines` 字段强制要求 |
| pnpm | `10.30.1` | 通过 `packageManager` 字段固定，推荐 `corepack enable` 后自动匹配 |

项目是**单包 Vite 应用**（不是 monorepo）：前端入口为 `index.tsx → App.tsx`，技术栈为 React 19 + TypeScript + Vite 6 + Tailwind CSS + shadcn/ui。

```bash
git clone https://github.com/<你的用户名>/EDU-PUBLISH.git
cd EDU-PUBLISH
pnpm install
pnpm run dev   # http://localhost:3000
```

## 常用命令

| 命令 | 作用 |
| :--- | :--- |
| `pnpm run dev` | 先跑一次 `compile:config` + `build:content`，再启动 Vite 开发服务器 |
| `pnpm run build` | 完整构建（`prebuild` 钩子串起整条流水线，见[构建流水线详解](/dev/manual)） |
| `pnpm run preview` | 预览 `dist/` 构建产物 |
| `pnpm run validate` | 用 AJV 按 `schemas/` 校验 `site.yaml` 与 `widgets.yaml`（**不校验** `subscriptions.yaml`） |
| `pnpm run compile:config` | 重新编译站点/挂件配置与 PWA manifest |
| `pnpm run build:content` | 重新编译 Markdown 卡片为 JSON |
| `node --test tests/theme-vars.test.mjs` | 跑单个测试（项目用 `node:test`，无测试框架） |

## 目录结构（开发者视角）

```
EDU-PUBLISH/
├── index.tsx / App.tsx   # 前端入口
├── components/           # React 组件（ui/ 为 shadcn 基础件，widgets/ 为功能件）
├── hooks/                # 状态与数据 hooks
├── lib/                  # 共享工具（site-config.ts / widgets-config.ts 等）
├── services/             # 服务层（rssService 等）
├── functions/            # Cloudflare Pages Functions（/api 浏览量接口）
│   └── lib/view-store.ts # 可插拔 ViewStore 接口（内置 D1 实现）
├── scripts/              # 构建脚本（Node ESM）
├── schemas/              # JSON Schema（site / widgets）
├── config/               # 三个 YAML 配置（唯一数据源）
├── content/              # Agent 产出的卡片与摘要
├── public/generated/     # 编译产物（gitignore，勿手改）
└── tests/                # node:test 单测
```

## 必须知道的几个机制

### 配置是编译进前端的，不会热更新

`config/*.yaml` 与 `content/**/*.md` 在构建前由脚本编译为 `public/generated/*.json`，`lib/site-config.ts` 和 `lib/widgets-config.ts` **直接 import 这些 JSON**。Vite 不监听 YAML/Markdown：

- 改了 `site.yaml` / `widgets.yaml` → 重跑 `pnpm run compile:config` 或重启 dev。
- 改了 `content/**` 或 `subscriptions.yaml` → 重跑 `pnpm run build:content` 或重启 dev。
- 如果页面显示的配置"不生效"，第一反应应该是生成的 JSON 过期了，而不是前端 bug。

### index.html 占位符注入

`vite.config.ts` 中的 `siteConfigHtmlPlugin` 会把 `index.html` 里的 `{{SITE_NAME}}`、`{{SITE_DESCRIPTION}}`、`{{THEME_COLOR}}`、`{{DEFAULT_HUE}}` 等占位符替换为 `site.yaml` 的值。改动站点级 SEO/主题时优先改 YAML，不要硬编码进 HTML。

### 路径别名

TS 路径别名 `@/*` 解析到项目根目录（`tsconfig.json` 与 `vite.config.ts` 各配置了一份，改动需同步）。

### /api 代理与静默降级

Vite dev 把 `/api` 代理到 `http://127.0.0.1:8788`（Wrangler）。本地调试浏览量接口时需另起：

```bash
npx wrangler pages dev dist
```

**没有** Wrangler 在跑时，浏览量等功能会静默降级（不计数、不报错）——这是设计行为，别把这种"安静"当成前端故障。S3、D1 等可选配置缺失时同理。

## 开发约定与边界

- **不要手改生成物**：`public/generated/**`、`public/rss/**`、`public/rss.xml`、`dist/` 都是构建产物且已 `.gitignore`。
- **`archive/` 只读**：它由外部程序（astrbot-QQtoLocal）写入、独立管理；归档的 git 操作要在 `archive/` 子仓库内做，不要在主仓库里提交。
- **分支纪律**：自动化工作默认走 `test` 分支，`main` 留给人工审核后的发布。
- **组件约定**（见 `components/AGENTS.md`）：只用函数组件；样式只用 Tailwind 工具类，禁止内联 style；图片一律通过 `services/rssService.ts` 的 `getMediaUrl()` 解析地址。
- 脚本与配置是事实来源；文档（包括 README）描述与代码冲突时以代码为准。

下一篇：[构建流水线详解](/dev/manual)。
