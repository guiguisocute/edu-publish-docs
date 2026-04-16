# 手动部署

适合希望完全掌控部署流程，或部署到非 Cloudflare 平台的场景。

## 本地构建

```bash
# 安装依赖
pnpm install

# 执行构建
pnpm run build

# 本地预览（可选）
pnpm run preview
```

构建产物输出到 `dist/` 目录，可直接部署到任意静态托管平台。

## 部署到 Cloudflare Pages（手动上传）

如果不想使用 Git 集成，可通过 Wrangler CLI 手动上传：

```bash
# 安装 wrangler
pnpm add -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy dist --project-name=<your-project-name>
```

## 部署到 Vercel

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 部署
vercel --prod
```

在 Vercel 控制台配置：

| 配置项 | 填写值 |
| :--- | :--- |
| **Build Command** | `pnpm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `pnpm install` |

## 部署到 Netlify

```bash
# 安装 Netlify CLI
pnpm add -g netlify-cli

# 部署
netlify deploy --prod --dir=dist
```

## 部署到 GitHub Pages

1. 在仓库 **Settings → Pages** 中选择 **GitHub Actions** 作为 Source。
2. 创建 `.github/workflows/pages.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 部署到任意静态服务器

将 `dist/` 目录的内容上传到任何支持静态文件的服务器即可。

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name notice.example.edu.cn;
    root /var/www/edu-publish/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Caddy 配置示例

```
notice.example.edu.cn {
    root * /var/www/edu-publish/dist
    file_server
    try_files {path} /index.html
}
```

::: warning SPA 路由
无论部署到哪个平台，都需要配置 fallback 到 `index.html`，以确保单页面应用 (SPA) 的路由正常工作。如果不配置，直接访问子路径会返回 404。
:::
