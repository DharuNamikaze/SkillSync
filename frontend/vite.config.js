import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // Ensures assets are loaded from root
  server: {
    host: '0.0.0.0', // 👈 makes it accessible outside the container
    port: 5173       // 👈 stick to 5173 or change if it conflicts
  }
})
