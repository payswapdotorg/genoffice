import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: ['@genoffice/project-engine'] })],
  },
  preload: {
    plugins: [externalizeDepsPlugin({ exclude: ['@genoffice/project-engine'] })],
  },
  renderer: {
    plugins: [react()],
    server: {
      port: Number(process.env.PROJECT_DEV_PORT) || 5181,
      strictPort: Boolean(process.env.PROJECT_DEV_PORT),
    },
  },
})
