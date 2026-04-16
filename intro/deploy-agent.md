# Agent 引导部署 <Badge type="tip" text="推荐" />

最简单的部署方式——让 AI Agent 帮你完成一切。

## 简述
fork并clone[本项目仓库](https://github.com/guiguisocute/EDU-PUBLISH)后，进入到仓库目录，启动你的agent软件（CLI，GUI，IDE）均可，在输入框输入：
```text
阅读 .agent/SETUP.md 并按步骤执行
```
随后等待自动agent自动部署完成即可，期间你的agent可能会暂停工作，等待你输入下一步指令，请按照agent的提示与实际情况输入即可。

等待docker容器启动并且测试通过后，你的agent会指引你是否将本项目的用户展示页部署到Cloudflare Pages，根据自己实际情况选择

## 详细操作

:::tip
**如果你完全看不懂简述章节的内容，别急，请接着往后阅读更详细的指引。**
:::

## 前置准备1：Fork仓库
1. 访问 [guiguisocute/EDU-PUBLISH](https://github.com/guiguisocute/EDU-PUBLISH)。

2. 依次按图示点击操作：
   1. ![]( https://r2.guiguisocute.cloud/PicGo/2026/04/16/34b664df1b83fa72ad084dc33347a777.png)
   2. ![]( https://r2.guiguisocute.cloud/PicGo/2026/04/16/31995ca4b58181e131e48fed7623679e.png)
   3. ![]( https://r2.guiguisocute.cloud/PicGo/2026/04/16/3c25ef10e84184a58bdfee787ec5bc21.png)
   4. ![]( https://r2.guiguisocute.cloud/PicGo/2026/04/16/7e5504cfbbd875f9530441d76f2e1b4e.png)

确保自己复制到了`第四步`图示中的仓库地址，找个地方粘贴保存，后续会用到

## 前置准备2：下载git
:::warning
如果你电脑上还没有安装 Git，请务必先按以下步骤安装，否则后续自动部署将会失败，如果你已经安装git，可以跳过这一步
:::

1. **下载 Git**：

   - **Windows 用户**：点击访问 [Git 官方下载页面](https://git-scm.com/download/win)，下载 `64-bit Git for Windows Setup`。
   - **Mac 用户**：点击访问 [Git 官方下载页面](https://git-scm.com/download/mac)，下载安装包。

2. **傻瓜式安装**：

   双击下载好的安装程序，**什么都不用改，全程直接无脑点击 “Next” (下一步)**，直到安装完成（点击 “Finish”）。

## 前置准备3：Clone (克隆) 仓库到本地
1. **新建一个空文件夹**：

   在你的电脑上（比如桌面，或者 D 盘）新建一个普通的文件夹，用来存放这个项目的代码。

2. **打开命令行黑框**：

   - **Windows 用户（最简单的方法）**：进入你刚新建的文件夹里面，在空白处**点击鼠标右键**，选择 **`用终端打开`或者`Open in Terminal`**
  ![]( https://r2.guiguisocute.cloud/PicGo/2026/04/16/d613cf35d65cc9e52a3fc441ac6e3f82.png)
   - **Mac 用户**：按下 `Command + 空格`，搜索并打开“终端 (Terminal)”。然后输入 `cd `（注意 `cd` 后面有一个空格），接着把你新建的空文件夹**拖拽**到终端窗口里，按下回车。

3. **下载代码**：

   在打开的黑框框中，复制并粘贴以下命令（**注意：请将下面的链接替换为你自己在第四步图片中复制的仓库地址！**）：

   ```bash
   git clone https://github.com/你的用户名/EDU-PUBLISH.git
   ```

   *按下回车键，等待进度条走到 100%，代码就成功下载到你的电脑上了。*

---


## 用你的Agent开始配置本项目环境
1. **CLI 类 Agent（**OpenCode**、**Claude Code**、**Qoder CLI** 等：）**  
  
  - 克隆完成后，在终端（黑框）输入：`cd Desktop\EDU-PUBLISH`,中进入项目文件夹后，直接运行 Agent，然后粘贴上面的指令。  
  示例（以 Claude Code 为例）：  

  ```bash
  claude
  ```
  - 启动后在交互式输入框直接输入
  ```text
  阅读 .agent/SETUP.md 并按步骤执行
  ```
![如图所示]( https://r2.guiguisocute.cloud/PicGo/2026/04/16/e2a381f9d6d77c9f762637fa7714f7c1.png)

---

**② IDE 类 Agent（**Trae**、**Antigravity**、**Cursor**、**Windsurf**、**Qoder IDE** 等）**  


  1. 用该 IDE 打开 `EDU-PUBLISH` 项目文件夹。通知在首页会有明显的说明文本为“打开文件夹”的UI
   
  2. 在右侧/底部/侧边栏的 **Agent 聊天窗口** 或 **Composer / Builder / Agent Mode** 中，粘贴指令：
   ```text
   阅读 .agent/SETUP.md 并按步骤执行
   ```  

---

**③ GUI 类 Agent（**QClaw**、**WorkBuddy**、**Qoder GUI** 等桌面/聊天式 Agent）**  
  1. 确保 Agent 能访问你的本地文件夹（通常需要授予权限或把项目文件夹拖进去）。  

  2. 在聊天界面直接输入指令：  

     ```
     我已经 fork 并 clone 了 EDU-PUBLISH 项目，文件夹在桌面/EDU-PUBLISH。请阅读 .agent/SETUP.md 并帮我一步步完成部署。
     ```

  3. 这些 Agent 通常支持语音或更自然的对话，你可以像跟朋友聊天一样说：“帮我部署这个大学通知聚合站项目，按照 SETUP.md 来。”

## 部署上线
等一切通过以后，你的agent会指引你是否将本项目的用户展示页部署到Cloudflare Pages，根据自己实际情况选择。