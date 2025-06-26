import netlify from '@astrojs/netlify'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'server',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  adapter: netlify(),
})
