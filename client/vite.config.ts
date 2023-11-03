import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
