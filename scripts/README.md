# 脚本说明

## update-version.js

自动更新文档版本信息的脚本。

### 功能

- 从根目录的 `package.json` 读取当前版本号
- 更新 `docs/guide/introduction.md` 文件中的版本显示
- 在发布流程中自动执行，确保版本信息始终保持同步

### 使用方法

#### 手动运行
```bash
pnpm run update-docs-version
# 或者
node scripts/update-version.js
```

#### 自动运行
脚本会自动在 `pnpm run release` 流程中执行：

```bash
pnpm run release
# 执行顺序：
# 1. pnpm build - 构建项目
# 2. changeset version - 更新版本号
# 3. node scripts/update-version.js - 更新文档版本
# 4. changeset publish - 发布到 npm
```

### 工作原理

1. 读取 `package.json` 中的 `version` 字段
2. 使用正则表达式匹配文档中的版本信息格式：`当前版本：v[版本号]`
3. 替换为最新的版本号
4. 写回文档文件

### 注意事项

- 确保 `docs/guide/introduction.md` 文件存在且格式正确
- 版本信息必须遵循 `当前版本：v[数字]` 的格式
- 脚本会在发布前自动执行，无需手动干预