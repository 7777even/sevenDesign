const fs = require('fs');
const path = require('path');

/**
 * 自动更新文档中的版本信息
 * 从 package.json 读取当前版本，更新 introduction.md 中的版本显示
 */

// 读取根目录的 package.json
const rootDir = path.join(__dirname, '..');
const packagePath = path.join(rootDir, 'package.json');
const introPath = path.join(rootDir, 'docs', 'guide', 'introduction.md');

try {
  // 读取 package.json
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  const currentVersion = packageJson.version;

  // 读取 introduction.md 文件
  let introContent = fs.readFileSync(introPath, 'utf-8');

  // 使用正则表达式替换版本信息
  // 匹配 "当前版本：v" 后面跟着版本号的模式
  const versionRegex = /当前版本：v[\d\.]+/;
  const newVersionText = `当前版本：v${currentVersion}`;

  if (versionRegex.test(introContent)) {
    introContent = introContent.replace(versionRegex, newVersionText);

    // 写回文件
    fs.writeFileSync(introPath, introContent, 'utf-8');

    console.log(`✅ 文档版本已自动更新为 v${currentVersion}`);
    console.log(`📄 更新文件: docs/guide/introduction.md`);
  } else {
    console.warn('⚠️  未找到版本信息匹配项，请检查 introduction.md 文件格式');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ 更新版本失败:', error.message);
  process.exit(1);
}