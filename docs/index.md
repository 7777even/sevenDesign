---
pageType: home

hero:
  name: SevenDesign
  text: 企业级 React UI 组件库
  tagline: 现代化、可定制、TypeScript 驱动的组件库
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 组件示例
      link: /components/button
  image:
    src: /logo.svg
    alt: SevenDesign Logo

features:
  - title: 🎨 精美设计
    details: 现代化的设计风格，参考 Element Plus，提供优雅的用户体验
  - title: 📦 开箱即用
    details: 丰富的组件库，满足企业级应用的各种需求
  - title: 🔧 TypeScript
    details: 完整的类型定义，提供更好的开发体验和代码提示
  - title: 🎭 主题定制
    details: 基于 CSS Variables 的主题系统，轻松定制你的品牌风格
  - title: ⚡ 按需加载
    details: 支持 Tree-shaking，只打包你使用的组件，减小打包体积
  - title: 📚 完善文档
    details: 详细的组件文档和示例代码，帮助你快速上手
---

## 安装

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

## 快速开始

```tsx
import { Button } from 'seven-design'
import 'seven-design/dist/style.css'

function App() {
  return <Button type="primary">点击我</Button>
}
```

## 特性

### 企业级设计

SevenDesign 采用现代化的设计语言，参考了 Element Plus 的设计理念，为企业级应用提供统一、专业的视觉体验。

### TypeScript 支持

所有组件都使用 TypeScript 编写，提供完整的类型定义，让你在开发时获得更好的代码提示和类型检查。

### 主题定制

基于 CSS Variables 的主题系统，你可以轻松定制组件的颜色、尺寸等样式，打造符合你品牌风格的 UI。

### 按需引入

支持 Tree-shaking，只打包你实际使用的组件，有效减小项目的打包体积。

## 社区

- [GitHub](https://github.com/sevendesign/sevendesign)
- [NPM](https://www.npmjs.com/package/seven-design)
- [问题反馈](https://github.com/sevendesign/sevendesign/issues)
