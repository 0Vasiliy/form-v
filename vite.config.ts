import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // base: '/form-v/', //Раскоментрировать для деплоя на gh-pages
  plugins: [vue()],
})
