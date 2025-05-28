import fs from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass'
import svgr from 'vite-plugin-svgr'
// import mkcert from 'vite-plugin-mkcert'


// https://vitejs.dev/config/
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
        clientPort: 80,
        protocol: "ws"
      }
    },
        // server: {
    //   proxy: {
    //     '/api': {
    //       target: 'https://localhost:8443',
    //       changeOrigin: true,
    //       secure: false,
    //       withCredentials: true,
    //       configure: (proxy, _options) => {
    //         proxy.on('error', (err, _req, _res) => {
    //           console.log('proxy error', err);
    //         });
    //         proxy.on('proxyReq', (proxyReq, req, _res) => {
    //           console.log('Sending Request to the Target:', req.method, req.url);
    //         });
    //         proxy.on('proxyRes', (proxyRes, req, _res) => {
    //           console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
    //         });
    //       }
    //       // rewrite: (path: string) => path.replace(/^\/api/, '/api'),
    //     }
    //   },
    css: {
      preprocessorOptions: {
        scss: {
          implementation: sass,
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
