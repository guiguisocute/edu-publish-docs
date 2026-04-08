# 快速开始

推荐使用 **Agent 引导部署**，它将为您自动完成从零到一的搭建。

## 部署方式

### 1. Agent 引导部署 (推荐)
适合从零开始搭建完整链路。

1. **Fork 仓库**: 在 GitHub 网页端 fork [guiguisocute/EDU-PUBLISH](https://github.com/guiguisocute/EDU-PUBLISH)。
2. **本地 Clone**: 将 fork 的仓库克隆到本地。
3. **Agent 执行**: 在项目根目录让 agent 阅读并执行 `.agent/DEPLOY.md`。

Agent 将自动完成以下工作：
- Docker 环境检查
- NapCat + EDU-PUBLISH 部署
- 归档插件配置
- 消息链路验证

### 2. GitHub Actions + Cloudflare Pages
在本地链路跑通后，配置 GitHub Secrets 即可实现自动化上线。

#### Cloudflare Pages 控制台配置指南
在 Cloudflare Pages 仪表盘中，请确保使用以下参数：

- **Framework preset**: `VitePress`
- **Build command**: `npm run docs:build`
- **Build output directory**: `.vitepress/dist`
- **Root directory**: `/` (保持默认)

#### 必须配置的 GitHub Secrets:
- `CLOUDFLARE_PROJECT_NAME`: Pages 项目名
- `CLOUDFLARE_API_TOKEN`: API Token
- `CLOUDFLARE_ACCOUNT_ID`: Account ID
- `CLOUDFLARE_PAGES_URL`: 生产域名

## 环境要求

- **Node.js**: >= 22
- **pnpm**: 推荐作为包管理器
- **Docker**: 用于运行消息桥接服务
