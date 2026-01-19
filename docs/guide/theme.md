# 主题定制

SevenDesign 使用 CSS Variables 实现主题定制，你可以轻松地修改组件的样式。

## CSS Variables

所有的设计 token 都以 CSS Variables 的形式暴露出来，你可以通过覆盖这些变量来自定义主题。

### 品牌色

```css
:root {
  --sd-color-primary: #409eff;
  --sd-color-success: #67c23a;
  --sd-color-warning: #e6a23c;
  --sd-color-danger: #f56c6c;
  --sd-color-info: #909399;
}
```

### 文本颜色

```css
:root {
  --sd-text-color-primary: #303133;
  --sd-text-color-regular: #606266;
  --sd-text-color-secondary: #909399;
  --sd-text-color-placeholder: #a8abb2;
  --sd-text-color-disabled: #c0c4cc;
}
```

### 边框颜色

```css
:root {
  --sd-border-color: #dcdfe6;
  --sd-border-color-light: #e4e7ed;
  --sd-border-color-lighter: #ebeef5;
  --sd-border-color-extra-light: #f2f6fc;
}
```

### 背景色

```css
:root {
  --sd-bg-color: #ffffff;
  --sd-bg-color-page: #f2f3f5;
  --sd-bg-color-overlay: #ffffff;
}
```

## 自定义主题

### 方式一：覆盖 CSS Variables

在你的项目中创建一个样式文件，覆盖默认的 CSS Variables：

```css
/* custom-theme.css */
:root {
  /* 修改主色调 */
  --sd-color-primary: #1890ff;
  
  /* 修改圆角 */
  --sd-border-radius-base: 8px;
  
  /* 修改字体大小 */
  --sd-font-size-base: 16px;
}
```

然后在你的应用入口引入：

```tsx
import 'seven-design/dist/style.css'
import './custom-theme.css'
```

### 方式二：使用内联样式

你也可以直接在 HTML 中修改 CSS Variables：

```tsx
function App() {
  return (
    <div
      style={{
        '--sd-color-primary': '#1890ff',
        '--sd-border-radius-base': '8px',
      } as React.CSSProperties}
    >
      <Button type="primary">自定义主题按钮</Button>
    </div>
  )
}
```

## 暗色主题

SevenDesign 内置了暗色主题支持，只需在根元素添加 `.sd-dark` 类名：

```tsx
function App() {
  const [dark, setDark] = React.useState(false)

  return (
    <div className={dark ? 'sd-dark' : ''}>
      <button onClick={() => setDark(!dark)}>切换主题</button>
      <Button type="primary">按钮</Button>
    </div>
  )
}
```

### 自定义暗色主题

你也可以覆盖暗色主题的 CSS Variables：

```css
/* custom-dark-theme.css */
.sd-dark {
  --sd-color-primary: #177ddc;
  --sd-bg-color: #1f1f1f;
  --sd-text-color-primary: #e5e5e5;
}
```

## 完整的 CSS Variables 列表

### 颜色

| 变量名                    | 说明           | 默认值    |
| ------------------------- | -------------- | --------- |
| `--sd-color-primary`      | 主色           | `#409eff` |
| `--sd-color-success`      | 成功色         | `#67c23a` |
| `--sd-color-warning`      | 警告色         | `#e6a23c` |
| `--sd-color-danger`       | 危险色         | `#f56c6c` |
| `--sd-color-info`         | 信息色         | `#909399` |
| `--sd-color-white`        | 白色           | `#ffffff` |
| `--sd-color-black`        | 黑色           | `#000000` |

### 文本颜色

| 变量名                          | 说明         | 默认值    |
| ------------------------------- | ------------ | --------- |
| `--sd-text-color-primary`       | 主要文本     | `#303133` |
| `--sd-text-color-regular`       | 常规文本     | `#606266` |
| `--sd-text-color-secondary`     | 次要文本     | `#909399` |
| `--sd-text-color-placeholder`   | 占位文本     | `#a8abb2` |
| `--sd-text-color-disabled`      | 禁用文本     | `#c0c4cc` |

### 边框

| 变量名                           | 说明         | 默认值    |
| -------------------------------- | ------------ | --------- |
| `--sd-border-color`              | 边框颜色     | `#dcdfe6` |
| `--sd-border-color-light`        | 浅边框       | `#e4e7ed` |
| `--sd-border-color-lighter`      | 更浅边框     | `#ebeef5` |
| `--sd-border-color-extra-light`  | 极浅边框     | `#f2f6fc` |
| `--sd-border-radius-base`        | 基础圆角     | `4px`     |
| `--sd-border-radius-small`       | 小圆角       | `2px`     |
| `--sd-border-radius-round`       | 圆形         | `20px`    |
| `--sd-border-radius-circle`      | 圆           | `100%`    |

### 字体

| 变量名                      | 说明         | 默认值  |
| --------------------------- | ------------ | ------- |
| `--sd-font-size-extra-large`| 超大字号     | `20px`  |
| `--sd-font-size-large`      | 大字号       | `18px`  |
| `--sd-font-size-medium`     | 中等字号     | `16px`  |
| `--sd-font-size-base`       | 基础字号     | `14px`  |
| `--sd-font-size-small`      | 小字号       | `13px`  |
| `--sd-font-size-extra-small`| 超小字号     | `12px`  |

### 组件尺寸

| 变量名                          | 说明         | 默认值  |
| ------------------------------- | ------------ | ------- |
| `--sd-component-size-large`     | 大尺寸       | `40px`  |
| `--sd-component-size-default`   | 默认尺寸     | `32px`  |
| `--sd-component-size-small`     | 小尺寸       | `24px`  |

### 阴影

| 变量名                     | 说明         |
| -------------------------- | ------------ |
| `--sd-box-shadow-base`     | 基础阴影     |
| `--sd-box-shadow-light`    | 浅阴影       |
| `--sd-box-shadow-lighter`  | 更浅阴影     |
| `--sd-box-shadow-dark`     | 深阴影       |

## 示例

### 创建绿色主题

```css
/* green-theme.css */
:root {
  --sd-color-primary: #52c41a;
  --sd-color-primary-light-3: #7ed321;
  --sd-color-primary-light-5: #95de64;
  --sd-color-primary-light-7: #b7eb8f;
  --sd-color-primary-light-8: #d9f7be;
  --sd-color-primary-light-9: #f6ffed;
  --sd-color-primary-dark-2: #389e0d;
}
```

### 创建紧凑主题

```css
/* compact-theme.css */
:root {
  --sd-component-size-large: 36px;
  --sd-component-size-default: 28px;
  --sd-component-size-small: 20px;
  --sd-font-size-base: 12px;
  --sd-border-radius-base: 2px;
}
```

## 最佳实践

1. **保持一致性**：确保主题颜色在整个应用中保持一致
2. **考虑可访问性**：确保文本和背景色有足够的对比度
3. **测试暗色模式**：如果支持暗色模式，确保在两种模式下都测试过
4. **使用设计系统**：建议基于设计系统来定制主题，而不是随意修改
