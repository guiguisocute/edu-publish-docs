# 手动部署

本页面向**具备基本部署能力**的读者：你应当会使用终端、Git，了解 Docker 的基本概念，并能自行处理常见的环境问题。如果你更希望由 AI 全程代劳，请改用 [Agent 引导部署](./deploy-agent)。

EDU-PUBLISH 是三段式架构，三个阶段相互独立、可以分开部署：

| 阶段 | 做什么 | 运行位置 | 依赖 |
| :--- | :--- | :--- | :--- |
| ① 消息桥接 | 把 QQ 群消息落盘为本地 `archive/` 文件 | 一台常开的机器（本地或 VPS） | Docker + Docker Compose |
| ② Agent 内容生产 | AI 读取归档，生成结构化卡片 | 与 ① 同机最佳 | 任意 AI Agent（见[使用说明](/use/use)） |
| ③ 站点构建与发布 | 把卡片编译为静态站点并发布 | 本地构建 / 托管平台云端构建 | Node.js 22 + pnpm 10 |

::: tip 可以只部署一部分
- 只想先看看前端效果：跳过 ① ②，直接从 [第 2 节](#_2-阶段二-本地构建前端) 开始（仓库自带 Demo 数据）。
- 不用 QQ 作为消息源：任何能把消息写进 `archive/YYYY-MM-DD/messages.md` 的程序都可以替代阶段 ①。
:::

## 0. 前置要求

| 工具 | 版本要求 | 说明 |
| :--- | :--- | :--- |
| Git | 任意较新版本 | |
| Docker + Compose 插件 | Docker Engine 20+，`docker compose` V2 | 仅阶段 ① 需要 |
| Node.js | `>= 22` | 仅阶段 ②③ 需要 |
| pnpm | `10.x`（项目通过 `packageManager` 字段固定为 `pnpm@10.30.1`） | `corepack enable` 即可 |
| 一个 QQ 账号 | 建议使用小号 | 登录 NapCat 用，需在目标群内 |

宿主机推荐 Linux（Ubuntu/Debian）或 macOS；Windows 请在 WSL2 中操作，并注意把项目放在 WSL 文件系统内（如 `~/EDU-PUBLISH`），跨文件系统的 bind mount 性能极差。

## 1. Fork 并克隆仓库

```bash
# 先在 GitHub 网页端 fork guiguisocute/EDU-PUBLISH，然后：
git clone https://github.com/<你的用户名>/EDU-PUBLISH.git
cd EDU-PUBLISH
```

后续所有命令均在项目根目录执行。

## 2. 阶段一：消息桥接（NapCat + AstrBot）

消息桥接链路是 `QQ 群 → NapCat（QQ 协议层）→ AstrBot（机器人框架）→ astrbot-QQtoLocal 插件 → archive/ 落盘`。两个服务都跑在 Docker 里。

相关官方文档：

- NapCat：<https://napneko.github.io/>
- AstrBot：<https://astrbot.app/>
- 归档插件 astrbot-QQtoLocal：<https://github.com/guiguisocute/astrbot-QQtoLocal>

### 2.1 创建目录与 docker-compose.yml

仓库**不自带** `docker-compose.yml`，需要自己在项目根目录创建：

```bash
mkdir -p data napcat/config ntqq archive
```

```yaml
# docker-compose.yml
# 基于 https://github.com/NapNeko/NapCat-Docker/blob/main/compose/astrbot.yml

services:
  napcat:
    image: mlikiowa/napcat-docker:latest
    container_name: napcat
    restart: always
    environment:
      - NAPCAT_UID=${NAPCAT_UID:-1000}
      - NAPCAT_GID=${NAPCAT_GID:-1000}
      - MODE=astrbot
    ports:
      - "6099:6099"
    volumes:
      - ./data:/AstrBot/data
      - ./napcat/config:/app/napcat/config
      - ./ntqq:/app/.config/QQ
    networks:
      - astrbot_network

  astrbot:
    image: soulter/astrbot:latest
    container_name: astrbot
    restart: always
    environment:
      - TZ=Asia/Shanghai
    ports:
      - "6185:6185"
    volumes:
      - ./data:/AstrBot/data
      - ./archive:/AstrBot/data/archive
    networks:
      - astrbot_network

networks:
  astrbot_network:
    driver: bridge
```

::: warning 关键挂载
`./archive:/AstrBot/data/archive` 这一行决定了插件写入的归档能直接落进项目的 `archive/` 目录，不要遗漏或改名。
:::

### 2.2 启动容器

```bash
docker compose pull
docker compose up -d
docker compose ps   # 预期 napcat 与 astrbot 均为 Up
```

::: warning 权限提醒
AstrBot 容器以 root 运行，写入 bind mount 后宿主机文件会变为 root 所有。首次启动后建议执行：

```bash
sudo chown -R $USER:$USER data archive
```

否则后续编辑配置或读取归档时可能遇到 `EACCES`。
:::

### 2.3 登录 QQ（NapCat WebUI）

NapCat 在 6099 端口提供管理 WebUI，登录后页面内会显示可扫码的二维码图片（比终端二维码可靠得多）。

1. 从日志中抓取带 token 的 WebUI 地址：

   ```bash
   docker logs napcat 2>&1 | grep -oE "http://[^ ]*webui[^ ]*token=[A-Za-z0-9_\-]+" | tail -1
   ```

   抓不到时可读配置文件 `napcat/config/webui.json` 中的 `token` 字段；首次启动默认 token 为字符串 `napcat`（首次登录后会强制改密）。

2. 浏览器打开 `http://localhost:6099/webui?token=<token>`，用手机 QQ 扫码登录。

   如果服务在远程 VPS 上，**不要直接把 6099 暴露到公网**，在本地另开终端做 SSH 端口转发：

   ```bash
   ssh -L 6099:localhost:6099 <用户名>@<服务器地址>
   ```

3. 验证登录成功：

   ```bash
   docker logs napcat 2>&1 | tail -30   # 查找 login success / 登录成功 / 账号昵称
   ```

### 2.4 打通 NapCat ↔ AstrBot 的 WebSocket

NapCat 以 `MODE=astrbot` 启动后会主动连 `ws://astrbot:6199/ws`，但 **AstrBot 默认没有启用 OneBot v11 平台配置**，NapCat 会持续 `ECONNREFUSED`。需要手动补一段配置：

编辑 `data/cmd_config.json`，在 `platform` 数组中添加（也可以在 AstrBot 控制台 `http://localhost:6185` 的「平台适配」里添加 aiocqhttp 反向 WebSocket，效果相同）：

```json
{
  "id": "default",
  "type": "aiocqhttp",
  "enable": true,
  "ws_reverse_host": "0.0.0.0",
  "ws_reverse_port": 6199,
  "ws_reverse_token": ""
}
```

然后重启并验证：

```bash
docker restart astrbot
docker logs --since 2m astrbot 2>&1 | grep -i -E "connect|adapter|websocket|napcat" | tail -10
```

### 2.5 安装并配置 astrbot-QQtoLocal 插件

**安装**（二选一）：

- 控制台：打开 `http://localhost:6185` → 插件市场 → 搜索 `astrbot-QQtoLocal` → 安装。
- 命令行：

  ```bash
  docker exec astrbot git clone https://github.com/guiguisocute/astrbot-QQtoLocal.git /AstrBot/data/plugins/astrbot-QQtoLocal
  docker restart astrbot
  ```

**配置**：在控制台「插件管理 → astrbot-QQtoLocal → 配置」中填写，或直接编辑 `data/config/astrbot-QQtoLocal_config.json`：

| 字段 | 值 | 说明 |
| :--- | :--- | :--- |
| `banshi_group_list` | `["<你的群号>"]` | 需要监听的 QQ 群号列表 |
| `enable_markdown_archive` | `true` | 启用本地 Markdown 归档 |
| `archive_root` | `/AstrBot/data/archive` | ⚠️ **必须改**。默认值是 `/AstrBot/data/qq2tg_archive`，与 compose 挂载路径不符 |
| `archive_save_assets` | `true` | 保存图片与文件附件 |
| `archive_asset_max_mb` | `20` | 单个附件大小上限（MB） |

改完重启：`docker restart astrbot`。

插件还支持可选的 Telegram / Discord 转发（`/qq2tg_bind_target`、`/qq2dc_bind_target`），不需要可保持 `enable_telegram_forward` / `enable_discord_forward` 为 `false`，详见[插件仓库](https://github.com/guiguisocute/astrbot-QQtoLocal)。

### 2.6 端到端验证

在被监听的 QQ 群里发 2-3 条任意消息，然后：

```bash
TODAY=$(date +%Y-%m-%d)
ls -la archive/$TODAY/
tail -20 archive/$TODAY/messages.md
```

出现 `archive/YYYY-MM-DD/messages.md` 且内容与你发的消息对应，即桥接链路打通。失败时排查：

- 目录没建出来 → 检查插件 `archive_root` 是否为 `/AstrBot/data/archive`、`enable_markdown_archive` 是否为 `true`。
- 目录在但文件为空 → 检查 `banshi_group_list` 是否包含目标群号。
- AstrBot 日志中 `in_source=True`、`归档成功` 字样是插件正常工作的标志：

  ```bash
  docker logs astrbot --since 2m 2>&1 | grep -i -E "in_source|归档" | tail -10
  ```

## 3. 阶段二：本地构建前端

```bash
pnpm install
pnpm run validate   # 校验 config/site.yaml 与 config/widgets.yaml
pnpm run dev        # http://localhost:3000
pnpm run build      # 产物输出到 dist/
```

`pnpm run build` 会自动按顺序执行：配置校验 → 配置编译 → 内容编译 → 图片优化 → RSS 生成 → Vite 构建。

::: warning YAML 改动不会热更新
`config/*.yaml` 与 `content/**/*.md` 都是在构建前由脚本编译成 JSON 的，Vite 不会监听它们。修改后需要重跑对应脚本（`pnpm run compile:config` / `pnpm run build:content`）或直接重启 `pnpm run dev`。
:::

### 3.1 清空 Demo 数据（可选）

仓库自带演示卡片，正式使用前可清掉：

```bash
rm -rf content/card/demo/ public/attachments/demo/
rm -f content/card/covers/* public/covers/*
pnpm run build
```

注意**不要**把 `config/subscriptions.yaml` 清成空数组——编译脚本要求 `schools` 至少有 1 个条目、每个 school 的 `subscriptions` 至少有 1 条，否则构建直接失败。

### 3.2 自定义站点配置

把站点改成自己学校的信息，只需要改 `config/` 下三个 YAML：

| 文件 | 用途 |
| :--- | :--- |
| `site.yaml` | 站名、Logo、SEO、页脚、主题色、`github_actions_enabled` 开关 |
| `subscriptions.yaml` | 通知分类 + 学院/单位与订阅源（决定站点导航结构） |
| `widgets.yaml` | 模块开关与组件参数（日历、看板、摘要等） |

字段详解见 [YAML 格式及含义](/use/format)。

## 4. 阶段三：发布站点

构建产物 `dist/` 是纯静态站点，任意静态托管均可。三种常见方式：

### 方式 A：Cloudflare Pages Git 直连（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com) → `Workers & Pages` → `Create` → `Import an existing Git repository`，关联你的 fork。
2. 构建设置：

   | 配置项 | 值 |
   | :--- | :--- |
   | Production branch | `main` |
   | Build command | `pnpm run build` |
   | Build output directory | `dist` |

3. 环境变量（`Settings → Environment variables`）：`NODE_VERSION = 22`、`SITE_URL = https://<你的域名>`。

此后 push 即自动构建部署；非生产分支（如 Agent 工作用的 `test` 分支）的 push 会自动生成预览 URL，正好用于发布前审核。自定义域名在 `Custom domains` 中绑定。参考 [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)。

### 方式 B：GitHub Actions + wrangler

仓库内置 `.github/workflows/deploy.yml`（`test` 分支触发）与 `deploy-main.yml`（`main` 分支触发）。使用前：

1. 把 `config/site.yaml` 中的 `github_actions_enabled` 改为 `true`（默认是 `false`，此时两个 workflow 会直接跳过部署 job——**skipped 不是故障**）。
2. 在仓库 `Settings → Secrets and variables → Actions` 添加：

   | Secret | 说明 |
   | :--- | :--- |
   | `CLOUDFLARE_PROJECT_NAME` | Pages 项目名 |
   | `CLOUDFLARE_API_TOKEN` | 具有 Pages Deploy 权限的 API Token |
   | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |
   | `CLOUDFLARE_PAGES_URL` | 生产环境完整 HTTPS URL |
   | `CLOUDFLARE_PAGES_TEST_URL` | 测试预览环境完整 HTTPS URL |

3. `git push origin test` 触发，在 Actions 页查看运行状态。

### 方式 C：其它静态平台（Vercel / Netlify / GitHub Pages 等）

通用配置：

| 配置项 | 值 |
| :--- | :--- |
| Build command | `pnpm run build` |
| Output directory | `dist` |
| Node.js version | `22` |
| Install command | `pnpm install` |
| 环境变量 | `SITE_URL=<站点域名>` |

## 5. 可选增强

两项都是**可选**的，缺少配置时构建脚本静默跳过，不影响站点运行。

### S3 兼容对象存储（大附件托管）

当附件总量逼近平台限制（如 CF Pages 单文件 25MB / 2 万文件）时启用。支持任何 S3 兼容服务商（AWS S3、Cloudflare R2、MinIO、Backblaze B2 等）。在 `.env`（本地构建）或平台环境变量中配置：

```bash
S3_BUCKET=
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_BASE_URL=
ATTACHMENT_UPLOAD_THRESHOLD_MB=20   # 超过此大小的附件上传到 S3
```

### 浏览量统计（Cloudflare D1）

1. 在 CF Dashboard 创建 D1 数据库。
2. 在 Pages 项目 `Settings → Bindings` 绑定该数据库，Binding name 填 `DB`。
3. 表结构在首次请求时自动创建。

未绑定数据库时浏览量自动降级为不计数模式。如需接其它数据库，`functions/lib/view-store.ts` 提供了可扩展的 `ViewStore` 接口。

## 6. 故障排查速查

| 症状 | 排查 |
| :--- | :--- |
| 容器启动失败 | `docker compose logs napcat` / `docker compose logs astrbot` |
| 终端二维码乱码 | 改走 WebUI：`http://localhost:6099/webui?token=...` |
| WebUI 打不开 / token 无效 | `docker restart napcat` 后重新从日志抓 URL，或用默认 token `napcat` |
| 远程服务器上 WebUI 本地访问不了 | `ssh -L 6099:localhost:6099 user@server` 端口转发 |
| WebSocket 连不上 | `docker network inspect astrbot_network` 确认两容器同网络；检查 2.4 节的平台配置 |
| 端口冲突 | `ss -tlnp \| grep -E "6099\|6185"`，改 compose 端口映射 |
| `archive/` 无内容 | `docker exec astrbot ls /AstrBot/data/archive/` 检查挂载；核对插件配置 |
| 插件未加载 | `docker logs astrbot \| grep -i plugin` |
| `pnpm run build` 失败 | 检查 Node 版本是否为 22、YAML 是否通过 `pnpm run validate` |

部署完成后，接下来请阅读[使用说明书](/use/use)，了解如何让 Agent 把归档变成站点上的卡片。
