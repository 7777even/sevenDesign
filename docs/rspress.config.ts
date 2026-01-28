import { defineConfig } from 'rspress/config'
import { pluginPreview } from '@rspress/plugin-preview'

export default defineConfig({
  // Rspress 默认 root 是 "docs"（相对于当前工作目录）。
  // 本项目的 markdown/mdx 就在 docs/ 目录根部，所以这里需要显式设置为 "."
  // 否则会去 docs/docs/** 下面找路由，导致所有页面 404。
  base: '/sevenDesign/',
  root: '.',
  
  // 只把 markdown/mdx 当作页面路由，避免把配置文件等非页面文件打进客户端路由
  route: {
    extensions: ['.md', '.mdx'],
  },
  title: 'SevenDesign',
  description: '企业级 React UI 组件库',
  icon: '/logo.svg',
  plugins: [
    pluginPreview({
      defaultRenderMode: 'pure',
      // preview 代码块会被抽成独立模块，不会继承 MDX 顶部 import
      // 这里统一注入 React + 组件库的 import，避免 "Button is not defined" 这类运行时错误
      previewCodeTransform: ({ code }) => {
        const injected = [
          "import React from 'react';",
          "import { Button, Input, Switch, Pagination, Cascader, Form, MessageProvider, MessageContainer, $message, Table } from '@seven-design-ui/components';",
          "import '@seven-design-ui/components/dist/style.css';",
          '',
        ].join('\n')

        return injected + code
      },
    }),
  ],
  markdown: {
    // 预览插件需要 JS 版 MDX 编译器
    mdxRs: false,
  },
  logo: {
    light: '/logo.svg',
    dark: '/logo.svg',
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/7777even/sevenDesign.git',
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
            {
              text: 'Form 表单',
              link: '/components/form',
            },
            {
              text: 'Cascader 级联选择器',
              link: '/components/cascader',
            },
          ],
        },
        {
          text: '数据展示',
          items: [
            {
              text: 'Table 表格',
              link: '/components/table',
            },
            {
              text: 'Pagination 分页器',
              link: '/components/pagination',
            },
            {
              text: 'Message 消息提示',
              link: '/components/message',
            },
          ],
        },
      ],
    },
  },
})
