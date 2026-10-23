import fs from 'node:fs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

/**
 * Plugin para resolver la incompatibilidad de Vite/Rolldown en rutas con '#'.
 * Vite's internal cleanUrl() descarta todo lo que sigue al carácter '#',
 * interpretándolo erróneamente como un hash fragment de URL. Este plugin
 * intercepta la lectura del archivo de código fuente antes del fallo de fsp.readFile().
 */
function hashPathPlugin() {
  return {
    name: 'hash-path-plugin',
    enforce: 'pre',
    load(id) {
      if (id.includes('node_modules') || id.startsWith('\0')) return null
      const cleanPath = id.replace(/\?.*$/, '')
      if (cleanPath.includes('#') && fs.existsSync(cleanPath)) {
        try {
          if (fs.statSync(cleanPath).isFile()) {
            return fs.readFileSync(cleanPath, 'utf-8')
          }
        } catch {
          return null
        }
      }
      return null
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [hashPathPlugin(), react(), tailwindcss()],
  server: {
    port: 5173,
  },
})
