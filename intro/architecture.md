# 整体架构

EDU-PUBLISH 采用三段式独立架构，各模块相互解耦，可以根据需求灵活选择运行。

## 架构流程图

```mermaid
flowchart LR
  subgraph bridge["步骤1：消息桥接"]
    direction TB
    QQ["QQ 群消息"] --> NapCat["NapCat"]
    NapCat --> AstrBot["AstrBot + 归档插件"]
    AstrBot --> archive["archive/YYYY-MM-DD/"]
  end

  subgraph agent["步骤2：Agent 内容生产"]
    direction TB
    read["读取 archive/"] --> parse["解析 + 去重 + 合并"]
    parse --> card["content/card/*.md"]
    card --> push["git push test"]
  end

  subgraph deploy["步骤3：站点部署"]
    direction TB
    actions["GitHub Actions"] --> build["pnpm run build"]
    build --> dist["dist/ 静态站点"]
    dist --> host["Cloudflare Pages<br/>或任意静态服务器"]
  end

  bridge --> agent --> deploy
```

## 各阶段职责

- **消息桥接**: 负责将 QQ 协议的消息落盘为本地文件。
- **Agent 生产**: 读取本地归档，利用 AI 自动生成结构化的 Markdown 卡片。
- **站点部署**: 自动将生成的 Markdown 内容构建并发布为静态站点。
