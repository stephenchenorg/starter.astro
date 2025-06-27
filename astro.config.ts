import netlify from '@astrojs/netlify'
import { defineConfig } from 'astro/config'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  adapter: netlify(),
})
