import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: "EDU-PUBLISH",
  description: "通用高校通知聚合站技术文档",
  ignoreDeadLinks: true, // 忽略死链检查，确保构建稳定
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '演示站', link: 'https://example.edu.cn' },
      { text: 'GitHub', link: 'https://github.com/guiguisocute/EDU-PUBLISH' }
    ],

    sidebar: {
      '/intro/': [
        {
          text: '简介和部署',
          collapsed: false,
          items: [
            { text: '什么是 EDU-PUBLISH', link: '/intro/' },
            { text: '整体架构', link: '/intro/architecture' },
            { text: '快速开始', link: '/intro/deploy' }
          ]
        }
      ],
      '/use/': [
        {
          text: '使用',
          collapsed: false,
          items: [
            { text: '步骤1：消息桥接', link: '/use/bridge' },
            { text: '步骤2：Agent 内容生产', link: '/use/agent' },
            { text: '步骤3：站点部署', link: '/use/deploy-site' }
          ]
        }
      ],
      '/dev/': [
        {
          text: '开发指南',
          collapsed: false,
          items: [
            { text: '开发环境准备', link: '/dev/' },
            { text: '手动部署流程', link: '/dev/manual' }
          ]
        },
        {
          text: '渲染测试 (第一层)',
          collapsed: false,
          items: [
            { text: 'Markdown 基础', link: '/dev/tests/markdown' },
            {
              text: '嵌套折叠测试 (第二层)',
              collapsed: true,
              items: [
                { text: '提示块与容器', link: '/dev/tests/blocks' },
                { text: '代码块与高亮', link: '/dev/tests/code' }
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/guiguisocute/EDU-PUBLISH' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present'
    }
  }
}))
