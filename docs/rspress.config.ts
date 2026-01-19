import { defineConfig } from 'rspress/config'

export default defineConfig({
  // Rspress 默认 root 是 "docs"（相对于当前工作目录）。
  // 本项目的 markdown/mdx 就在 docs/ 目录根部，所以这里需要显式设置为 "."
  // 否则会去 docs/docs/** 下面找路由，导致所有页面 404。
  root: '.',
  title: 'SevenDesign',
  description: '企业级 React UI 组件库',
  icon: '/logo.svg',
  logo: {
    light: '/logo.svg',
    dark: '/logo.svg',
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/sevendesign/sevendesign',
      },
    ],
    nav: [
      {
        text: '指南',
        link: '/guide/introduction',
      },
      {
        text: '组件',
        link: '/components/button',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            {
              text: '介绍',
              link: '/guide/introduction',
            },
            {
              text: '快速开始',
              link: '/guide/quick-start',
            },
            {
              text: '主题定制',
              link: '/guide/theme',
            },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            {
              text: 'Button 按钮',
              link: '/components/button',
            },
          ],
        },
        {
          text: '表单组件',
          items: [
            {
              text: 'Input 输入框',
              link: '/components/input',
            },
            {
              text: 'Switch 开关',
              link: '/components/switch',
            },
          ],
        },
      ],
    },
  },
})
