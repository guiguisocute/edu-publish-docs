# 插件开发指南

AstrBot 欢迎开发者贡献插件！

## 准备工作

在开始开发之前，请确保已安装以下开发工具：
- Python 3.10+
- VS Code (推荐)
- pnpm (用于 WebUI 插件)

## 编写第一个插件

1. **创建插件目录**: 在 `data/plugins` 下新建文件夹。
2. **编写元数据**: 编写 `metadata.yaml`。
3. **编写逻辑**: 在 `main.py` 中编写您的 AI 插件逻辑。

```python
from astrbot.api.event import filter, AstrMessageEvent
from astrbot.api.star import Star

class MyPlugin(Star):
    @filter.command("hello")
    async def hello(self, event: AstrMessageEvent):
        yield event.plain_result("你好！这是我的第一个插件！")
```

## 发布插件

您可以将插件上传到 GitHub，并向官方申请加入插件市场。

::: tip
建议将插件放置在 `data/plugins/` 目录下进行实时热重载调试。
:::
