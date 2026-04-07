# 步骤3：站点部署

站点部署阶段负责将生成的卡片构建为静态站点，并发布到云端。

## 构建流程

1. **Actions 触发**: 仓库 `test` 分支的 push 动作将自动触发 GitHub Actions。
2. **静态构建**: 执行 `pnpm run build`。
3. **输出产物**: 生成 `dist/` 静态站点目录。
4. **云端托管**: 自动部署到 Cloudflare Pages 或任何静态服务器。

## 核心脚本

- `pnpm install`: 安装依赖。
- `pnpm run build`: 生产环境构建。
- `pnpm run preview`: 预览本地构建产物。

## Cloudflare Pages

建议将 Cloudflare Pages 与仓库的 `main` (或 `master`) 分支绑定，实现自动化上线。

### 控制台构建配置 (必填)
为了确保构建成功，请在 Cloudflare Pages 仪表盘中填写以下参数：

| 配置项 | 填写值 |
| :--- | :--- |
| **Framework preset** | `VitePress` |
| **Build command** | `npm run docs:build` |
| **Build output directory** | `.vitepress/dist` |

::: warning
部署时需配置 fallback 到 `index.html`，以确保单页面应用 (SPA) 的路由正常工作。
:::
