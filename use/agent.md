# 步骤2：Agent 内容生产

Agent 内容生产阶段负责读取本地归档，并利用 AI 自动生成结构化的 Markdown 卡片。

## 生产流程

1. **读取归档**: 扫描 `archive/` 目录中的新消息。
2. **AI 解析**: 使用 Agent (如 Claude, OpenAI 等) 进行解析、去重和合并。
3. **卡片生成**: 将处理后的内容保存为 `content/card/<school_slug>/*.md`。
4. **校验推送**: 校验内容通过后，自动 push 到仓库的 `test` 分支。

## 核心规则

- **解析**: 自动识别通知的标题、正文、发布时间及发布单位。
- **去重**: 过滤重复发布的相同通知。
- **摘要**: 自动生成简洁的摘要，方便用户快速浏览。

## 目录结构

```text
content/
  └── card/
      └── school_name/
          └── notification_id.md  # 结构化卡片
```

::: tip
Agent 仅操作 `content/` 和 `worklog/` 目录，不会改动项目配置或核心代码。
:::
