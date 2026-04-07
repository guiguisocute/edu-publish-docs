# 开发环境准备

欢迎参与 EDU-PUBLISH 的开发。

## 技术栈

- **前端**: Vue 3 + Tailwind CSS
- **构建工具**: Vite
- **文档**: VitePress
- **部署**: Cloudflare Pages / GitHub Actions
- **协议层**: NapCat (QQ)

## 环境要求

- **Node.js**: >= 22 (推荐最新 LTS 版本)
- **pnpm**: 推荐作为主要的包管理器

## 本地开发步骤

1. **安装依赖**:
   ```bash
   pnpm install
   ```
2. **生成测试内容**:
   ```bash
   node scripts/generate-demo-content.mjs
   ```
3. **启动开发服务器**:
   ```bash
   pnpm run dev
   ```
4. **构建站点**:
   ```bash
   pnpm run build
   ```

::: info
开发环境支持热更新，任何代码改动都会实时反映在本地预览中。
:::
