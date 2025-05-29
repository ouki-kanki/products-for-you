import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass'
import svgr from 'vite-plugin-svgr'
// import mkcert from 'vite-plugin-mkcert'


export default defineConfig(({ mode }) => {
  const isDebug = process.env.VITE_DEBUG

  return {
    plugins: [
      react(),
      svgr(),
      // mkcert()
    ],
    server: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts: ["client"],
      cors: true,
      hmr: {
        host: "localhost",
        clientPort: 443,
        protocol: "wss"
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          implementation: sass,
          // TODO: need to fix this.this is very bad for opt
          // this makes vite to include main.sccs to every scss file that compliles
          additionalData: `
            @use "./src/styles/_main.scss" as *;
            `,
        }
      },
      devSourcemap: isDebug
    },
  }
})
