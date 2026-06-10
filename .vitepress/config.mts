import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: "EDU-PUBLISH",
  description: "通用高校通知聚合站技术文档",
  ignoreDeadLinks: true, // 忽略死链检查，确保构建稳定
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '演示站', link: 'https://edu-publish.site' },
      { text: 'GitHub', link: 'https://github.com/guiguisocute/EDU-PUBLISH' }
    ],

    sidebar: {
      '/intro/': [
        {
          text: '简介',
          collapsed: false,
          items: [
            { text: '什么是 EDU-PUBLISH', link: '/intro/' },
            { text: '整体架构', link: '/intro/architecture' },
            { text: '常见问题', link: '/intro/faq' }
          ]
        },
        {
          text: '部署',
          collapsed: false,
          items: [
            { text: 'Agent 引导部署', link: '/intro/deploy-agent' },
            { text: '手动部署', link: '/intro/deploy-manual' }
          ]
        }
      ],
      '/use/': [
        {
          text: '使用',
          collapsed: false,
          items: [
            { text: '客制化你的站点', link: '/use/customize' },
            { text: '具体操作流程', link: '/use/use' },
            { text: 'YAML 格式及含义', link: '/use/format' }
          ]
        }
      ],
      '/dev/': [
        {
          text: '开发指南',
          collapsed: false,
          items: [
            { text: '开发环境准备', link: '/dev/' },
            { text: '构建流水线详解', link: '/dev/manual' }
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
