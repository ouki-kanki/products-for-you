import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass'
import svgr from 'vite-plugin-svgr'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
        // this makes vite to include main.sccs to every scss file that compliles
        additionalData: `
          @use "./src/styles/_main.scss" as *;
          `,
      }
    }
  }
})
