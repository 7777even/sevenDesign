# 贡献指南

感谢你考虑为 SevenDesign 做出贡献！

## 开发设置

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 安装 pnpm（如果还没有安装）
npm install -g pnpm

# 克隆仓库
git clone https://github.com/7777even/sevenDesign.git
cd sevenDesign

# 安装依赖
pnpm install
```

### 项目结构

```
seven-design-ui/
├── packages/
│   ├── components/      # UI 组件库
│   │   ├── src/
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── core/           # 核心工具和 hooks
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   └── package.json
│   └── theme/          # 主题样式
│       ├── src/
│       │   └── index.css
│       └── package.json
├── docs/               # 文档站点（Rspress）
│   ├── guide/
│   ├── components/
│   └── rspress.config.ts
├── play/               # 本地开发调试
│   ├── src/
│   └── package.json
└── scripts/            # 构建脚本
```

## 开发流程

### 启动开发环境

```bash
# 启动 playground（推荐）
pnpm dev

# 启动文档站点
pnpm docs:dev
```

### 构建项目

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm build:components
pnpm build:core
pnpm build:theme
```

### 代码规范

```bash
# 运行 lint
pnpm lint

# 格式化代码
pnpm format
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test -- --watch
```

## 添加新组件

### 1. 创建组件文件

在 `packages/components/src/` 下创建新组件目录：

```
packages/components/src/
└── your-component/
    ├── YourComponent.tsx
    ├── your-component.css
    └── index.ts
```

### 2. 实现组件

```tsx
// YourComponent.tsx
import { forwardRef } from 'react'
import { classnames } from '@seven-design-ui/core'
import './your-component.css'

export interface YourComponentProps {
  // 定义 props
}

export const YourComponent = forwardRef<HTMLDivElement, YourComponentProps>((props, ref) => {
  // 实现组件逻辑
  return <div ref={ref} className="sd-your-component"></div>
})

YourComponent.displayName = 'YourComponent'
```

### 3. 添加样式

```css
/* your-component.css */
.sd-your-component {
  /* 样式实现 */
}
```

### 4. 导出组件

```ts
// index.ts
export { YourComponent } from './YourComponent'
export type { YourComponentProps } from './YourComponent'
```

在 `packages/components/src/index.ts` 中添加导出：

```ts
export * from './your-component'
```

### 5. 添加文档

在 `docs/components/` 下创建文档文件：

```mdx
# YourComponent 组件名称

组件描述

## 基础用法

\`\`\`tsx live
<YourComponent />
\`\`\`

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| ... | ... | ... | ... |
```

### 6. 在 Playground 中测试

在 `play/src/App.tsx` 中添加测试代码。

## 版本发布

### 使用 Changesets

1. 创建 changeset：

```bash
pnpm changeset
```

2. 选择要发布的包和版本类型（patch/minor/major）

3. 生成版本号：

```bash
pnpm version-packages
```

4. 发布到 npm：

```bash
pnpm release
```

### 手动发布流程

1. **更新版本号**

```bash
# 在各个 package.json 中更新版本号
# packages/components/package.json
# packages/core/package.json
# packages/theme/package.json
```

2. **构建所有包**

```bash
pnpm build
```

3. **发布到 npm**

```bash
# 发布 theme 包
cd packages/theme
npm publish --access public

# 发布 core 包
cd ../core
npm publish --access public

# 发布 components 包
cd ../components
npm publish --access public
```

4. **创建 Git 标签**

```bash
git tag v0.0.1
git push origin v0.0.1
```

## Pull Request 指南

### 提交 PR 前

1. 确保代码通过 lint 检查
2. 确保所有测试通过
3. 更新相关文档
4. 添加 changeset（如果需要）

### PR 标题格式

```
feat: 添加 XXX 组件
fix: 修复 XXX 问题
docs: 更新 XXX 文档
style: 优化 XXX 样式
refactor: 重构 XXX
test: 添加 XXX 测试
chore: 更新构建配置
```

### PR 描述模板

```markdown
## 改动说明

简要描述你的改动

## 改动类型

- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 样式优化
- [ ] 代码重构
- [ ] 测试补充

## 相关 Issue

Closes #issue_number

## 测试说明

描述如何测试这个改动

## 截图（如果适用）
```

## 代码风格

- 使用 TypeScript
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 组件名使用 PascalCase
- 函数名使用 camelCase
- CSS 类名使用 BEM 命名规范（`sd-component__element--modifier`）

## 提交规范

使用语义化的提交信息：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：

```
feat(button): 添加 loading 状态

- 添加 loading 属性
- 添加加载动画
- 更新文档

Closes #123
```

## 寻求帮助

如果你在贡献过程中遇到任何问题：

1. 查看 [文档](https://sevendesign.dev)
2. 搜索 [Issues](https://github.com/7777even/sevenDesign.git/issues)
3. 创建新的 Issue 提问

感谢你的贡献！ 🎉
