#!/bin/bash

# 清理所有 dist 目录
echo "🧹 清理构建产物..."
pnpm clean

# 构建 theme 包
echo "🎨 构建 theme 包..."
pnpm --filter @seven-design-ui/theme build

# 构建 core 包
echo "🔧 构建 core 包..."
pnpm --filter @seven-design-ui/core build

# 构建 components 包
echo "📦 构建 components 包..."
pnpm --filter @seven-design-ui/components build

echo "✅ 构建完成！"
