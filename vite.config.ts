import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  server:{
    open: true,
    https: true,
    port: 5173
  },
  plugins: [
    react(),
    mkcert()
  ],
})
