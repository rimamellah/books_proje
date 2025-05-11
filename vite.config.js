import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/books_proje/', // هذا مهم لمسار GitHub Pages
})

