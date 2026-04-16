# 什么是 EDU-PUBLISH

**EDU-PUBLISH** 是一个依赖 AstrBot 插件 `astrbot-QQtoLocal` 以及各类 Agent（如 Claude Code, OpenCode, Codex, OpenClaw…）自动分析整理的 **通用高校通知聚合站模板**。

UI 设计基于 [@Sallyn0225](https://github.com/Sallyn0225) 的 `gemini-rss-app`。

## 项目初衷

- **解放班委**: 自动接收并整理 QQ 群消息，减少人工转发压力。
- **打破信息差**: 聚合各学院、各部门的通知，让信息流动更顺畅。
- **结构化呈现**: 将杂乱的消息转化为带摘要、可搜索、带日历的结构化网页。

## 核心特性

| 特性 | 说明 |
| :--- | :--- |
| **PWA 支持** | 可作为应用安装到手机，支持离线访问 |
| **RSS 订阅** | 提供全站 `/rss.xml` 及按单位 `/rss/<school_slug>.xml` 的 Feed |
| **AI 摘要** | 自动提取通知核心内容，省去阅读长文的时间 |
| **全文搜索** | 支持关键词搜索和高级筛选 |
| **日历视图** | 按日期浏览通知，一目了然 |
| **数据看板** | 总通知数、今日通知、进行中活动等统计一览 |
| **暗色模式** | 支持暗色模式与调色板切换，完美适配移动端 |
| **浏览量统计** | 可选，基于 Cloudflare D1，无 D1 时自动降级 |
| **对象存储** | 可选 S3 兼容存储，用于大附件托管（任何 S3 兼容供应商） |

## 技术栈

| 类别 | 技术 |
| :--- | :--- |
| **前端框架** | React 19 + TypeScript + Vite 6 |
| **UI 组件** | Tailwind CSS + Radix UI / shadcn/ui |
| **动画** | Framer Motion |
| **图表** | Recharts |
| **内容编译** | gray-matter + marked + yaml (Node.js 脚本) |
| **图片优化** | Sharp |
| **配置校验** | AJV (JSON Schema 2020-12) |
| **浏览量** | ViewStore 接口（内置 D1 支持，可扩展） |
| **对象存储** | @aws-sdk/client-s3（可选，任何 S3 兼容供应商） |
| **消息桥接** | NapCat + AstrBot (Docker) |

## 三段式架构概览

EDU-PUBLISH 采用三段式独立架构，各模块相互解耦：

| 阶段 | 职责 | 关键组件 |
| :--- | :--- | :--- |
| 消息桥接 | QQ 群消息落盘为本地 `archive/` | NapCat + AstrBot + `astrbot-QQtoLocal` 插件 |
| Agent 生产 | AI 解析归档，生成结构化卡片到 `content/card/` | Claude Code / OpenCode / Codex / OpenClaw 等 |
| 站点部署 | `pnpm run build` 构建并发布静态站点 | Cloudflare Pages / GitHub Actions / 任意静态服务器 |

> 详细架构图请参阅 [整体架构](./architecture)。
