import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/getMetadata": {
        target: "http://us-central1-variable-font-helper.cloudfunctions.net",
        changeOrigin: true,
      }
    }
  }
})
