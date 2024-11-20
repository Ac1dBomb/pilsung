import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite'


export default defineConfig({
  plugins: [react()],  Icons({ /* options */ }),
  server: {
    proxy: { // Correct proxy configuration
      '/myapi': {  // '/api' or '/myapi', adjust as needed to match your backend
        target: 'http://localhost:3001', // Your backend URL (port should match your backend server)
        changeOrigin: true
      }
    }
  }
});