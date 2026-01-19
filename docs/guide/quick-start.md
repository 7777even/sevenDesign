# 快速开始

本节将介绍如何在项目中使用 SevenDesign。

## 安装

### 使用包管理器

::: code-group

```bash [npm]
npm install seven-design
```

```bash [pnpm]
pnpm add seven-design
```

```bash [yarn]
yarn add seven-design
```

:::

## 完整引入

在 main.ts 中写入以下内容：

```tsx
import { createRoot } from 'react-dom/client'
import App from './App'
// 引入样式
import 'seven-design/dist/style.css'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(<App />)
}
```

然后就可以在组件中使用了：

```tsx
import { Button } from 'seven-design'

function App() {
  return <Button type="primary">Hello SevenDesign</Button>
}

export default App
```

## 按需引入

SevenDesign 支持基于 ES modules 的 tree shaking，直接引入即可按需加载：

```tsx
import { Button, Input, Switch } from 'seven-design'
import 'seven-design/dist/style.css'

function App() {
  return (
    <>
      <Button type="primary">按钮</Button>
      <Input placeholder="请输入" />
      <Switch />
    </>
  )
}
```

## 全局配置

某些组件如 Button 等，可以通过全局配置来设置默认属性。

```tsx
import { ConfigProvider, Button } from 'seven-design'

function App() {
  return (
    <ConfigProvider size="large">
      <Button>大尺寸按钮</Button>
    </ConfigProvider>
  )
}
```

## Vite 项目

如果你使用 Vite 创建项目，可以直接使用 SevenDesign：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## Next.js 项目

在 Next.js 项目中使用 SevenDesign：

```tsx
// app/layout.tsx
import 'seven-design/dist/style.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// app/page.tsx
'use client'

import { Button } from 'seven-design'

export default function Home() {
  return <Button type="primary">Hello</Button>
}
```

## 开始使用

现在你可以开始使用 SevenDesign 了！访问 [组件文档](/components/button) 查看所有可用组件。
