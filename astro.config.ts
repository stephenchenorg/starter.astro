import { defineConfig } from 'astro/config'
import netlify from '@astrojs/netlify'

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'server',
  adapter: netlify(),
})
