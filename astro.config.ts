import netlify from '@astrojs/netlify'
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import icons from 'unplugin-icons/vite'

const site = 'https://www.example.com'
const isNetlify = process.env.NETLIFY === 'true'

export default defineConfig({
  site,
  output: 'server',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  adapter: isNetlify
    ? netlify({ devFeatures: false })
    : node({ mode: 'standalone' }),
  integrations: [
    vue(),
    sitemap({
      filter: (page: string) =>
        page !== `${site}/400` &&
        page !== `${site}/403` &&
        page !== `${site}/422` &&
        page !== `${site}/429` &&
        !page.startsWith(`${site}/api`) &&
        !page.startsWith(`${site}/auth`),
    }),
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
