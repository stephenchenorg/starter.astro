import netlify from '@astrojs/netlify'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import icons from 'unplugin-icons/vite'

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'server',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  adapter: netlify({
    devFeatures: false,
  }),
  integrations: [
    vue(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      icons({
        compiler: 'vue3',
      }),
    ],
  },
  security: {
    // Change built-in origin check to custom function
    // @see src/middleware.ts
    checkOrigin: false,
  },
})
