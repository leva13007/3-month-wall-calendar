/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from /<repo-name>/, not from /
  base: '/3-month-wall-calendar/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
  },
})
