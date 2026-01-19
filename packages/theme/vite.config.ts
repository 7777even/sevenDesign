import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SevenDesignTheme',
      fileName: 'index',
      formats: ['es'],
    },
    outDir: 'dist',
    cssCodeSplit: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'index.css',
      },
    },
  },
})
