import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()

  ],   server: {
    port: 5173,           // Use your desired port
    strictPort: true,     // Fail if port is taken, avoids fallback issues
    host: '0.0.0.0',      // Listen on all interfaces (LAN/devices)
    hmr: {
      port: 5173,         // HMR websocket port (should match server.port)
      clientPort: 5173,   // Ensures client uses the correct port
      // protocol: 'ws',  // Uncomment if you need to force ws/wss
      // host: 'localhost', // Uncomment if accessing via IP or custom domain
    }
  }
})
