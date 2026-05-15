import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// For GitHub Project Pages set base to `/<repository-name>/` (trailing slash).
const raw = (process.env.VITE_BASE || '/').trim()
const base = raw === '' || raw === '/' ? '/' : raw.endsWith('/') ? raw : `${raw}/`

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3002,
  },
})
