# GitHub Actions 部署

适合已经跑通本地链路后，配置自动化上线流水线。

## 步骤一：创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 **Workers & Pages**。
2. 创建一个新的 Pages 项目，连接你的 GitHub 仓库。
3. 在构建配置中填写：

| 配置项 | 填写值 |
| :--- | :--- |
| **Framework preset** | 无 (留空) |
| **Build command** | `pnpm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |

4. 在环境变量中添加：

| 变量名 | 值 |
| :--- | :--- |
| `NODE_VERSION` | `22` |
| `SITE_URL` | 你的站点域名 |

## 步骤二：配置 GitHub Secrets

在仓库的 **Settings → Secrets and variables → Actions** 中添加以下 Secrets：

### 必填 Secrets

| Secret 名称 | 说明 |
| :--- | :--- |
| `CLOUDFLARE_PROJECT_NAME` | Cloudflare Pages 项目名 |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |
| `CLOUDFLARE_PAGES_URL` | 生产域名（如 `https://example.edu.cn`） |

### 可选 Secrets（对象存储）

如果需要将大附件托管到 S3 兼容存储：

| Secret 名称 | 说明 |
| :--- | :--- |
| `S3_ENDPOINT` | S3 兼容存储端点 |
| `S3_BUCKET` | S3 存储桶名 |
| `S3_ACCESS_KEY_ID` | S3 Access Key |
| `S3_SECRET_ACCESS_KEY` | S3 Secret Key |

## 步骤三：启用 Actions

确保 `config/site.yaml` 中开启了 GitHub Actions：

```yaml
github_actions_enabled: true
```

配置完成后，推送代码将自动触发构建和部署。

## 分支策略

| 分支 | 触发 Workflow | 用途 |
| :--- | :--- | :--- |
| `test` | `deploy.yml` | 预览/测试部署，Agent 日常推送目标 |
| `main` | `deploy-main.yml` | 生产部署，通过 PR 合并触发 |

::: info 并发控制
两个 Workflow 均配置了并发控制，同一分支上不会出现同时运行的部署任务。
:::

## Workflow 执行流程

两个 Workflow 的执行步骤一致：

```
读取 site.yaml 配置门控
  → 校验 Cloudflare Secrets
  → 恢复内容快照
  → pnpm install
  → 上传大附件到 S3（可选）
  → pnpm run build
  → 生成 SPA fallback（404.html、_redirects）
  → wrangler pages deploy
```

## 获取 Cloudflare API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 进入 **My Profile → API Tokens → Create Token**。
3. 使用 **Edit Cloudflare Workers** 模板创建。
4. 确保 Token 具有以下权限：
   - **Account - Cloudflare Pages**: Edit
   - **Account - Cloudflare Workers Scripts**: Edit

## 自定义域名

部署完成后，可以在 Cloudflare Pages 控制台为项目绑定自定义域名：

1. 进入项目的 **Custom domains** 页面。
2. 添加你的域名（如 `notice.example.edu.cn`）。
3. 按提示配置 DNS 记录（CNAME 指向 `<project>.pages.dev`）。
