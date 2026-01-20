const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 构建目录路径
const buildDir = path.join(__dirname, '..', 'docs', 'doc_build');

// 确保构建目录存在
if (!fs.existsSync(buildDir)) {
  console.error('✗ 构建目录不存在，请先运行 pnpm docs:build');
  process.exit(1);
}

// 验证关键文件是否存在
if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
  console.error('✗ 构建输出目录中没有找到 index.html，请检查构建是否成功');
  process.exit(1);
}

// 使用 gh-pages 部署
// --nojekyll 选项会自动创建 .nojekyll 文件到 gh-pages 分支根目录
// --dotfiles 选项确保其他点文件也会被部署
try {
  console.log('开始部署到 gh-pages 分支...');
  console.log(`部署目录: ${buildDir}`);
  
  execSync(`npx gh-pages -d "${buildDir}" --nojekyll --dotfiles`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
  
  console.log('✓ 部署完成！');
  console.log('✓ .nojekyll 文件已自动添加到 gh-pages 分支根目录');
  console.log('请等待 1-2 分钟让 GitHub Pages 更新');
} catch (error) {
  console.error('✗ 部署失败:', error.message);
  process.exit(1);
}
