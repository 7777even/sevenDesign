import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      // components/core 指向源码，才能在 dev 下正确加载组件的 css import
      '@seven-design-ui/components': path.resolve(__dirname, '../packages/components/src'),
      '@seven-design-ui/core': path.resolve(__dirname, '../packages/core/src'),

      // theme 指向包根目录，保证 '@seven-design-ui/theme/src/index.css' 不会变成 src/src
      '@seven-design-ui/theme': path.resolve(__dirname, '../packages/theme'),
    },
  },
})
