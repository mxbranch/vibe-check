import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
// vite.config.ts
import { defineConfig } from 'vite'

const config = defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    netlify({
      dev: {
        edgeFunctions: {
          enabled: false,
        },
      },
    }),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
})

export default config
