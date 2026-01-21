# 发布指南

本文档说明如何发布 SevenDesign 组件库到 npm。

## 前置条件

1. **npm 账号**：确保你有 npm 账号并已登录

```bash
npm login
```

2. **权限**：确保你有发布权限（组织成员）

3. **代码质量**：确保所有测试通过，代码符合规范

```bash
pnpm lint
pnpm test
pnpm build
```

## 发布流程

### 方式一：使用 Changesets（推荐）

Changesets 是一个管理版本和变更日志的工具，推荐使用。

#### 1. 添加变更记录

当你完成一个功能或修复后，运行：

```bash
pnpm changeset
```

然后按照提示：
- 选择要发布的包（components、core、theme）
- 选择版本类型：
  - `patch`：bug 修复（0.0.1 → 0.0.2）
  - `minor`：新功能（0.0.1 → 0.1.0）
  - `major`：破坏性变更（0.0.1 → 1.0.0）
- 填写变更说明

这会在 `.changeset` 目录下创建一个 Markdown 文件。

#### 2. 提交变更记录

```bash
git add .
git commit -m "chore: add changeset"
git push
```

#### 3. 生成版本号和更新日志

```bash
pnpm version-packages
```

这会：
- 更新包的版本号
- 更新 CHANGELOG.md
- 删除 changeset 文件

#### 4. 提交版本更新

```bash
git add .
git commit -m "chore: version packages"
git push
```

#### 5. 发布到 npm

```bash
pnpm release
```

这会：
- 构建所有包
- 发布到 npm
- 创建 Git 标签

#### 6. 推送标签

```bash
git push --tags
```

### 方式二：手动发布

如果你不想使用 Changesets，可以手动发布。

#### 1. 更新版本号

手动更新各个包的 `package.json` 版本号：

```json
{
  "version": "0.0.2"
}
```

需要更新：
- `packages/theme/package.json`
- `packages/core/package.json`
- `packages/components/package.json`

#### 2. 更新 CHANGELOG

手动更新 `CHANGELOG.md` 文件。

#### 3. 构建所有包

```bash
pnpm build
```

#### 4. 发布 theme 包

```bash
cd packages/theme
npm publish --access public
cd ../..
```

#### 5. 发布 core 包

```bash
cd packages/core
npm publish --access public
cd ../..
```

#### 6. 发布 components 包

```bash
cd packages/components
npm publish --access public
cd ../..
```

#### 7. 创建 Git 标签

```bash
git tag v0.0.2
git push origin v0.0.2
```

## 版本规范

遵循 [语义化版本](https://semver.org/lang/zh-CN/)：

- **Major（主版本）**：不兼容的 API 变更
- **Minor（次版本）**：向下兼容的功能新增
- **Patch（修订版本）**：向下兼容的 bug 修复

### 版本示例

- `0.0.1` → `0.0.2`：修复 bug
- `0.0.2` → `0.1.0`：新增组件
- `0.1.0` → `1.0.0`：API 重大变更

## 发布检查清单

发布前请确认：

- [ ] 所有测试通过
- [ ] 代码通过 lint 检查
- [ ] 构建成功
- [ ] 文档已更新
- [ ] CHANGELOG 已更新
- [ ] README 版本号已更新
- [ ] 已在本地测试过

## Beta 版本发布

如果要发布 beta 版本：

```bash
# 更新版本为 beta
# packages/components/package.json
{
  "version": "0.1.0-beta.0"
}

# 发布时添加 tag
npm publish --access public --tag beta
```

用户安装 beta 版本：

```bash
npm install seven-design@beta
```

## 发布后

1. **验证发布**

访问 [npm](https://www.npmjs.com/package/@seven-design-ui/theme) 确认版本已发布。

2. **测试安装**

在新项目中测试安装：

```bash
npm install seven-design@latest
```

3. **发布公告**

在以下渠道发布更新公告：
- GitHub Releases
- 官方文档
- 社交媒体

4. **更新文档**

确保文档站点显示最新版本。

## 常见问题

### 发布失败：权限错误

确保你已登录 npm：

```bash
npm whoami
npm login
```

### 发布失败：版本已存在

你不能发布已存在的版本，需要更新版本号：

```bash
# 查看 npm 上的版本
npm view seven-design versions

# 更新版本号后重新发布
```

### 发布失败：网络问题

设置 npm 镜像：

```bash
npm config set registry https://registry.npmjs.org/
```

### 撤销发布

⚠️ 谨慎使用！只能撤销 24 小时内发布的版本：

```bash
npm unpublish seven-design@0.0.2
```

### 废弃版本

如果某个版本有问题，可以标记为废弃：

```bash
npm deprecate seven-design@0.0.2 "这个版本有 bug，请使用 0.0.3"
```

## 自动化发布（CI/CD）

可以使用 GitHub Actions 自动发布：

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          registry-url: 'https://registry.npmjs.org'
      
      - run: pnpm install
      - run: pnpm build
      - run: pnpm changeset publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 总结

推荐使用 Changesets 进行版本管理和发布，它可以：
- 自动生成 CHANGELOG
- 管理 monorepo 中的多个包
- 简化发布流程
- 支持 CI/CD 自动化

Happy releasing! 🚀
