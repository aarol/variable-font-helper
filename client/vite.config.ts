import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/getMetadata": {
        target: "http://127.0.0.1:5001/variable-font-helper/us-central1/getMetadata",
        changeOrigin: true,
      }
    }
  }
})
