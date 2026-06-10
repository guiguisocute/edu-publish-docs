# 客制化你的站点

刚部署完的站点还是"示例大学"模板：站名叫 EDU Publish、学院是信息工程学院/文学院/学生事务中心这几个演示条目。正式启用前的第一件事，就是把它改成**你自己学校的样子**。

好消息是：所有客制化都集中在 `config/` 目录的三个 YAML 文件和 `public/` 下的图标资源里，**完全不需要碰代码**。

| 文件 | 决定什么 |
| :--- | :--- |
| `config/site.yaml` | 站名、域名、Logo、页脚、SEO、主题色 |
| `config/subscriptions.yaml` | 左侧导航结构：通知分类、学院/单位、订阅源 |
| `config/widgets.yaml` | 功能开关：日历、看板、摘要、浏览量等模块 |

改法有两种：**让 AI 改（推荐）**和手动改。

## 方式一（推荐）：让 AI 帮你改

YAML 对缩进和结构很敏感，而且本项目有几条不显眼的硬约束（`slug` 不能有中文、`schools` 不能为空、`categories` 末尾必须留兜底项……）。与其对着文档逐行核对，不如把需求用人话告诉 Agent——它会自己阅读 `config/` 现有内容和 `schemas/` 校验规则，改完还能跑校验自查。

在项目根目录启动你的 Agent（Claude Code、Codex 等均可），直接描述需求。下面是几个可以直接复制的提示词模板：

**① 整站初始化（最常用，一次把模板换成你的学校）**

```text
请帮我把这个站点从示例模板改成我自己学校的配置：
- 学校：江西师范大学，站点名"师大通知站"，简称"师大通知"
- 域名：https://notice.example.cn
- 学院（一级导航）：软件学院、数学学院、校团委，每个学院先各建一个"学院通知"订阅源
- 通知分类：通知公告、竞赛相关、讲座活动、其它分类
- 主题色用绿色预设
改完后运行 pnpm run validate 确认通过，再重启 pnpm run dev 让我预览。
```

**② 新增一个学院或订阅源**

```text
在 config/subscriptions.yaml 里给"软件学院"新增一个订阅源"就业信息群"，
对应 QQ 群号 987654321（填到 number 字段用于消歧），排序放在最后。
改完跑 pnpm run validate。
```

**③ 调整主题色 / 站点品牌**

```text
把站点主题色换成自定义的紫色系（palette.preset 用 custom，主色给个合适的紫色），
页脚版权改成"© 2026 软件学院学生会"，GitHub 链接换成我的 fork 地址。
```

**④ 开关功能模块**

```text
我不需要浏览量统计和 PWA 安装提示，帮我在 widgets.yaml 里关掉这两个模块；
另外把搜索框的占位文案改成"搜索通知…"。
```

**⑤ 更换 Logo 和图标**

```text
我把校徽放在了桌面上（logo.png），帮我看看本项目的 Logo、favicon、
各学院图标分别放在哪个目录、site.yaml 里要怎么引用，然后帮我替换进去。
```

::: tip 为什么 Agent 平时不改配置，现在却可以？
`BOT_RULES.md` 禁止 Agent 在**日常内容生产**中自动修改 `config/`——那是为了防止它处理通知时擅动站点结构。客制化场景下是**你明确下达的指令**，不在此限。规范的 Agent 会在你授权后修改，并主动跑 `pnpm run validate` 自查。
:::

::: warning 改完记得看一眼
AI 改完后务必本地预览确认（`pnpm run dev`），尤其检查：站名与 Logo、左侧学院列表、分类筛选项。确认无误再提交推送。
:::

## 方式二：手动改

字段级的完整说明在 [YAML 格式及含义](/use/format)，这里只列每个文件的要点。

### site.yaml — 站点身份

必填字段：`site_name`、`site_short_name`、`site_description`、`site_url`、`organization_name`、`organization_unit_label`、`palette`。常改项：

```yaml
site_name: "师大通知站"
site_short_name: "师大通知"
site_description: "江西师范大学通知聚合站"
site_url: "https://notice.example.cn"
organization_name: "江西师范大学"

logo_light: "/icon.svg"      # 浅色模式 Logo
logo_dark: "/icon.svg"       # 深色模式 Logo
favicon: "/icon.svg"

footer:
  copyright: "© 2026 软件学院学生会"
  links:
    - label: "GitHub"
      url: "https://github.com/<你>/EDU-PUBLISH"

palette:
  preset: "green"            # red | blue | green | amber | custom
  primary: null              # preset 为 custom 时填 HSL 色值
  secondary: null
  accent: null
```

### subscriptions.yaml — 导航结构

三层结构：`categories`（分类枚举，**末尾项是兜底分类，别删**）→ `schools`（学院/单位）→ 每个 school 的 `subscriptions`（订阅源）。硬约束：

- `slug` 不能含中文和空格（它是卡片目录名和 RSS 路径）。
- `schools` 至少 1 个，每个 school 的 `subscriptions` 至少 1 条，否则构建失败。
- 订阅源的 `title` 要与 QQ 群消息的来源对应（同名群用 `number` 填群号消歧）。

### widgets.yaml — 功能开关

`modules` 是模块级总开关（布尔值），`widgets` 是各组件的细粒度参数（标题、占位文案、默认展开等）。关一个功能优先动 `modules`。

### 品牌图片资源

| 资源 | 位置 | 说明 |
| :--- | :--- | :--- |
| 站点图标 / favicon | `public/icon.svg`、`public/icon-192.png`、`public/icon-512.png` | PNG 两张供 PWA 使用 |
| 明暗 Logo | `public/img/logo-light.svg`、`public/img/logo-dark.svg` | 在 `site.yaml` 的 `logo_light/logo_dark` 引用 |
| 学院图标 | `public/img/unit-icon-*.svg` | 在 `subscriptions.yaml` 各 school/订阅源的 `icon` 引用，缺省可用 `/img/default-unit-icon.svg` |
| 默认封面 | `public/img/default-cover.svg` | 卡片无图时的兜底封面，`site.yaml` 的 `default_cover` |

## 改完之后：三步验证

```bash
pnpm run validate   # 1. 校验 site.yaml / widgets.yaml 格式
pnpm run dev        # 2. 重启预览（YAML 不热更新，必须重启）
pnpm run build      # 3. 全量构建，subscriptions.yaml 的结构错误在这一步暴露
```

本地确认无误后提交推送，托管平台会自动重新构建上线。

## 常见坑速查

| 现象 | 原因 |
| :--- | :--- |
| 改了 YAML 页面没变化 | 配置是编译进前端的，重跑 `pnpm run compile:config` / `build:content` 或重启 dev |
| 构建报 `schools` 相关错误 | `schools` 或某个 `subscriptions` 被清成了空数组 |
| 卡片目录 / RSS 路径异常 | `slug` 里混入了中文或空格 |
| Agent 生成的卡片分类很怪 | `categories` 末尾的兜底分类被删了，或分类改名后旧卡片没同步 |
| `validate` 通过但 `build` 失败 | `validate` 只查 `site.yaml` 和 `widgets.yaml`，`subscriptions.yaml` 的问题要到 `build:content` 才报 |

站点改成自己的样子之后，就可以进入日常使用了：[具体操作流程](/use/use)。
