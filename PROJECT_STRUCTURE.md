# SevenDesign 项目结构

## 📁 完整目录结构

```
seven-design-ui/
├── packages/                    # Monorepo 子包目录
│   ├── components/             # 组件库包
│   │   ├── src/
│   │   │   ├── button/        # Button 组件
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── button.css
│   │   │   │   └── index.ts
│   │   │   ├── input/         # Input 组件
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── input.css
│   │   │   │   └── index.ts
│   │   │   ├── switch/        # Switch 组件
│   │   │   │   ├── Switch.tsx
│   │   │   │   ├── switch.css
│   │   │   │   └── index.ts
│   │   │   └── index.ts       # 统一导出
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── core/                   # 核心工具包
│   │   ├── src/
│   │   │   ├── hooks/         # React Hooks
│   │   │   │   ├── useControllableState.ts
│   │   │   │   └── useEventListener.ts
│   │   │   ├── utils/         # 工具函数
│   │   │   │   └── classnames.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── theme/                  # 主题样式包
│       ├── src/
│       │   └── index.css      # 主题 CSS Variables
│       ├── package.json
│       └── vite.config.ts
│
├── docs/                       # 文档站点（Rspress）
│   ├── guide/                 # 指南文档
│   │   ├── introduction.md    # 介绍
│   │   ├── quick-start.md     # 快速开始
│   │   └── theme.md          # 主题定制
│   ├── components/            # 组件文档
│   │   ├── button.mdx        # Button 文档
│   │   ├── input.mdx         # Input 文档
│   │   └── switch.mdx        # Switch 文档
│   ├── index.md              # 首页
│   ├── package.json
│   └── rspress.config.ts      # Rspress 配置
│
├── play/                       # 本地开发调试环境
│   ├── src/
│   │   ├── App.tsx           # 测试组件的应用
│   │   ├── main.tsx          # 入口文件
│   │   └── index.css         # 样式
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── scripts/                    # 构建和发布脚本
│   └── build.sh               # 构建脚本
│
├── .changeset/                 # Changesets 配置（版本管理）
│
├── .github/                    # GitHub 配置
│   └── workflows/             # GitHub Actions
│
├── .eslintrc.json             # ESLint 配置
├── .gitignore                 # Git 忽略文件
├── .prettierrc.json           # Prettier 配置
├── CONTRIBUTING.md            # 贡献指南
├── LICENSE                    # 开源协议
├── package.json               # 根 package.json
├── pnpm-workspace.yaml        # pnpm workspace 配置
├── PROJECT_STRUCTURE.md       # 本文件
├── README.md                  # 项目说明
├── RELEASE.md                 # 发布指南
└── tsconfig.json              # TypeScript 配置
```

## 📦 包说明

### 1. @seven-design-ui/components

**职责**：UI 组件库主包

**包含内容**：
- Button、Input、Switch 等 UI 组件
- 组件样式（CSS）
- 组件类型定义（TypeScript）

**构建产物**：
- `dist/index.esm.js` - ES Module 格式
- `dist/index.cjs.js` - CommonJS 格式
- `dist/index.d.ts` - TypeScript 类型声明
- `dist/style.css` - 组件样式

**使用方式**：
```tsx
import { Button } from '@seven-design-ui/components'
import '@seven-design-ui/components/dist/style.css'
```

### 2. @seven-design-ui/core

**职责**：核心工具和 Hooks

**包含内容**：
- React Hooks（useControllableState、useEventListener 等）
- 工具函数（classnames、createBEM 等）
- 类型定义

**构建产物**：
- `dist/index.esm.js` - ES Module 格式
- `dist/index.cjs.js` - CommonJS 格式
- `dist/index.d.ts` - TypeScript 类型声明

**使用方式**：
```tsx
import { classnames, useControllableState } from '@seven-design-ui/core'
```

### 3. @seven-design-ui/theme

**职责**：主题样式系统

**包含内容**：
- CSS Variables 定义
- 基础样式
- 暗色主题

**构建产物**：
- `dist/index.css` - 主题样式文件

**使用方式**：
```tsx
import '@seven-design-ui/theme/dist/index.css'
```

## 🎮 开发环境

### play/

**职责**：本地开发和调试环境

**特点**：
- 实时预览组件效果
- 快速迭代开发
- 测试组件交互

**启动方式**：
```bash
pnpm dev
```

## 📚 文档站点

### docs/

**职责**：组件库文档网站

**技术栈**：Rspress

**包含内容**：
- 使用指南
- 组件文档
- API 说明
- 示例代码

**启动方式**：
```bash
pnpm docs:dev
```

## 🔧 工作流程

### 开发新组件

1. 在 `packages/components/src/` 创建组件目录
2. 实现组件逻辑和样式
3. 在 `packages/components/src/index.ts` 导出
4. 在 `play/src/App.tsx` 中测试
5. 在 `docs/components/` 编写文档
6. 构建并发布

### 构建流程

```bash
# 清理构建产物
pnpm clean

# 构建所有包（按依赖顺序）
pnpm build:theme    # 1. 先构建 theme
pnpm build:core     # 2. 再构建 core
pnpm build:components # 3. 最后构建 components

# 或一次性构建所有
pnpm build
```

### 发布流程

```bash
# 1. 添加变更记录
pnpm changeset

# 2. 生成版本号
pnpm version-packages

# 3. 发布到 npm
pnpm release
```

## 🎯 设计原则

### 1. 单一职责

每个包都有明确的职责：
- `theme`：只负责样式
- `core`：只负责工具和 Hooks
- `components`：只负责 UI 组件

### 2. 依赖方向

```
components → core → theme
    ↓
  用户项目
```

组件库依赖核心工具，核心工具不依赖组件。

### 3. BEM 命名

CSS 类名使用 BEM 规范：
```css
.sd-button             /* Block */
.sd-button__icon       /* Element */
.sd-button--primary    /* Modifier */
```

### 4. CSS Variables

所有样式使用 CSS Variables：
```css
:root {
  --sd-color-primary: #409eff;
  --sd-font-size-base: 14px;
}
```

### 5. TypeScript

所有代码使用 TypeScript，提供完整类型支持。

## 📊 包依赖关系

```
@seven-design-ui/components
  └── @seven-design-ui/core
      └── react
      └── react-dom
  └── @seven-design-ui/theme

@seven-design-ui/core
  └── react
  └── react-dom

@seven-design-ui/theme
  └── (无依赖)
```

## 🚀 性能优化

1. **按需加载**：支持 Tree-shaking
2. **样式隔离**：每个组件独立 CSS 文件
3. **类型优化**：使用 TypeScript 严格模式
4. **构建优化**：使用 Vite 构建

## 📝 文件命名规范

- 组件文件：`PascalCase.tsx`（如 `Button.tsx`）
- 样式文件：`kebab-case.css`（如 `button.css`）
- 工具文件：`camelCase.ts`（如 `classnames.ts`）
- 类型文件：`PascalCase.ts`（如 `ButtonProps.ts`）
- 测试文件：`*.test.tsx` 或 `*.spec.tsx`

## 🎨 样式组织

```
packages/theme/src/
  └── index.css           # 主题入口

packages/components/src/
  ├── button/
  │   └── button.css      # Button 样式
  ├── input/
  │   └── input.css       # Input 样式
  └── ...
```

每个组件的样式独立管理，主题样式统一在 theme 包中。

## 🧪 测试组织

```
packages/components/src/
  ├── button/
  │   ├── Button.tsx
  │   ├── Button.test.tsx  # 单元测试
  │   └── button.css
  └── ...
```

## 📦 发布包结构

发布到 npm 后的包结构：

```
@seven-design-ui/components/
  ├── dist/
  │   ├── index.esm.js     # ES Module
  │   ├── index.cjs.js     # CommonJS
  │   ├── index.d.ts       # 类型声明
  │   └── style.css        # 样式
  ├── src/                 # 源码（可选）
  ├── package.json
  └── README.md
```

## 🔗 相关链接

- [贡献指南](./CONTRIBUTING.md)
- [发布指南](./RELEASE.md)
- [开发文档](./docs/)
