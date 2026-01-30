# SevenDesign

<p align="center">
  <strong>企业级 React UI 组件库</strong>
</p>

<p align="center">
  一个现代化的、可定制的、TypeScript 驱动的 React 组件库
</p>

## ✨ 特性

- 🎨 **精美设计**：现代化的设计风格，参考 Element Plus
- 📦 **开箱即用**：丰富的组件库，满足企业级应用需求
- 🔧 **TypeScript**：完整的类型定义，提供更好的开发体验
- 🎭 **主题定制**：基于 CSS Variables 的主题系统
- ⚡ **按需加载**：支持 Tree-shaking，减小打包体积
- 📚 **完善文档**：详细的组件文档和示例

## 📦 安装

```bash
# npm
npm install seven-design-ui

# pnpm
pnpm add seven-design-ui

# yarn
yarn add seven-design-ui
```

## 🚀 快速开始

```tsx
import { Button } from 'seven-design-ui'
import 'seven-design-ui/dist/style.css'

function App() {
  return <Button type="primary">点击我</Button>
}
```

## 📖 文档

访问 [组件文档](https://7777even.github.io/sevenDesign/) 查看完整的组件列表和使用指南。

## 🔨 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发环境
pnpm dev

# 启动文档站点
pnpm docs:dev

# 构建所有包
pnpm build

# 运行测试
pnpm test
```

## 📁 项目结构

```
seven-design-ui/
├── packages/
│   ├── components/      # UI 组件库
│   ├── core/           # 核心工具和 hooks
│   └── theme/          # 主题样式
├── docs/               # 文档站点（Rspress）
├── play/               # 本地开发调试
└── scripts/            # 构建脚本
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

