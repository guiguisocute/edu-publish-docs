# EDU-PUBLISH Documentation

<p align="center">
  <img src="https://img.shields.io/badge/Powered%20by-VitePress-blue?style=for-the-badge&logo=vite" alt="Powered by VitePress">
  <img src="https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-orange?style=for-the-badge&logo=cloudflare" alt="Deployed on Cloudflare Pages">
</p>

本项目是 **EDU-PUBLISH (高校通知聚合站)** 的官方技术文档。采用 VitePress 构建，旨在为开发者和班委提供清晰的部署与使用指引。

## 📖 文档架构

本仓库的架构像素级参考了 [EDU-PUBLISH](https://github.com/EDU-PUBLISHDevs/EDU-PUBLISH) 的文档设计：

- **`.vitepress/`**: 网站核心配置与主题样式。
- **`intro/`**: 项目简介、整体架构图及快速开始。
- **`use/`**: 核心环节说明（消息桥接、Agent 内容生产、站点部署）。
- **`config/`**: 详细的 YAML 配置文件参数说明。
- **`dev/`**: 开发环境准备与手动部署流程。

## 🚀 快速预览

您可以直接访问已部署的在线文档：
👉 **[https://edu-publish-docs.pages.dev/](https://edu-publish-docs.pages.dev/)**

## 🛠️ 本地开发

如果您想在本地修改并预览文档：

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run docs:dev
```

## 📄 开源协议

本项目遵循 MIT License 协议开源。
