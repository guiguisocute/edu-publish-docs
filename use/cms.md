# CMS 管理后台

Agent 自动整理覆盖了绝大部分日常，但总有需要**人工精修**的时刻——改个错字、调整分类、补一份附件、删一张失效卡片。为此项目提供了配套的独立子项目 [EDU-PUBLISH-CMS](https://github.com/guiguisocute/EDU-PUBLISH-CMS)：一个纯浏览器端的无状态内容管理系统，登录 GitHub 后即可在网页里直接管理你的 EDU-PUBLISH 站点内容，不需要本地环境、不需要懂 YAML。

![EDU-PUBLISH-CMS 编辑界面](https://r2.guiguisocute.cloud/PicGo/2026/04/15/2a75e269ab436596aa1e325e2e1f58dc.png)

## 它是什么

- **专为 EDU-PUBLISH 内容模型设计**：内置卡片解析器与序列化工具，frontmatter 以表单呈现，正文用 Markdown 编辑器，支持拖拽排序与实时预览。
- **安全架构**：浏览器从不直接与 GitHub 通信。GitHub OAuth 登录、会话管理、仓库读取、工作区同步与发布提交，全部经由 Cloudflare Worker 后端流转。
- **无状态 Serverless**：SPA 前端与后端 API 一并部署在 Cloudflare Workers 上，没有数据库、没有服务器要维护。
- **与主链路同一套契约**：CMS 的每次"发布"就是一次 Git 提交，与 Agent 的自动提交走完全相同的构建校验与部署流程——人工与 AI 在同一套审核流下协作。

## 部署

完整步骤见 [CMS 仓库 README](https://github.com/guiguisocute/EDU-PUBLISH-CMS)，要点如下：

### 第一步：创建 GitHub OAuth App

在 GitHub `Settings → Developer settings → OAuth Apps` 中新建应用：

- **Homepage URL**：你预期的 Worker 地址，如 `https://edu-publish-cms.<你的账户>.workers.dev`
- **Authorization callback URL**：`<Homepage URL>/api/auth/github/callback`（格式严格）

记下 **Client ID**，并生成一个 **Client Secret**。

### 第二步：部署到 Cloudflare Workers（二选一）

**方案 A — Dashboard 网页部署（推荐，零本地环境）**：

1. Cloudflare Dashboard → `Workers & Pages` → `Create application` → `Workers` → `Connect to GitHub`，选中你 fork 的 `EDU-PUBLISH-CMS` 仓库。
2. Build command 填 `pnpm run build`（其余配置自动读取仓库内 `wrangler.toml`）。
3. 以 **Secret (Encrypted)** 形式添加 4 个环境变量：

   | 变量 | 说明 |
   | :--- | :--- |
   | `GITHUB_CLIENT_ID` | 第一步获取 |
   | `GITHUB_CLIENT_SECRET` | 第一步获取 |
   | `SESSION_SECRET` | 任意 32 位以上无规律长字符串 |
   | `APP_URL` | 你的 Worker 首页地址（不带末尾斜杠） |

4. `Save and Deploy`，一分钟内前后端同时上线。

**方案 B — 本地 wrangler CLI**：

```bash
pnpm install && pnpm run build
pnpm dlx wrangler deploy
# 然后逐个注入密钥
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler secret put SESSION_SECRET
npx wrangler secret put APP_URL
```

::: tip 部署完成后
访问你的 `APP_URL`，用 GitHub 账号登录，系统会自动列出你**有权限的仓库**——选中你的 EDU-PUBLISH fork 即可开始编辑。记得回 GitHub OAuth App 设置里把 Homepage URL 更新为最终地址。
:::

## 日常使用流程

1. **登录**：打开 CMS 地址，GitHub OAuth 一键登录。
2. **选库**：选择你的 EDU-PUBLISH 仓库与分支（建议选 `test`，与 Agent 的工作分支一致）。
3. **编辑**：在工作区中浏览卡片列表，点开即可修改标题、分类、时间、附件与正文；诊断侧边栏会提示字段问题。
4. **发布**：确认草稿后一键发布，CMS 以你的身份创建 Git 提交——后续的预览构建、审核合并与 [具体操作流程](/use/use) 中完全一致。

## 本地开发（面向贡献者）

```bash
# 项目根目录创建 .dev.vars，填入上面 4 个变量（APP_URL=http://localhost:8788）
pnpm run dev   # 同时启动 Vite 前端(3000) 与 Wrangler 后端(8788)
pnpm run typecheck
pnpm run test:unit          # vitest 单元测试
pnpm run test:integration   # Worker 路由与 GitHub 接口集成测试
pnpm run test:e2e           # Playwright 端到端测试
```

代码结构速览：`worker/`（鉴权与 API 路由）、`lib/content/`（卡片解析/序列化/预览编译）、`lib/github/`（GitHub API 封装）、`components/cms/`（编辑器界面）。
