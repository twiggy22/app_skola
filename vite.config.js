import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/app_skola/', // DŮLEŽITÉ: Změňte na název vašeho repozitáře na GitHubu (např. '/moje-skola/')
})
