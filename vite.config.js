import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Pro vlastní doménu (např. skola.iteb.cz) musí být base '/'
})
