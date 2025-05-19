const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // Cấu hình đường dẫn cơ sở cho GitHub Pages
  publicPath: process.env.NODE_ENV === 'production' 
    ? '/sdtc-website/' 
    : '/',
  // Thư mục output khi build
  outputDir: 'dist'
})
