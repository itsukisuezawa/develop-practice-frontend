import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 8080,
    allowedHosts: [
      'frontend-itsukisuezawa-dev.apps.rm3.7wse.p1.openshiftapps.com'
    ]
  }
})
