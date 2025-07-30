import netlify from '@astrojs/netlify'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'server',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  adapter: netlify(),
  integrations: [
    vue(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
