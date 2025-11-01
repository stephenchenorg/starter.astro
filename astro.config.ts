import netlify from '@astrojs/netlify'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import icons from 'unplugin-icons/vite'

const site = 'https://www.dentalk.com.tw'

export default defineConfig({
  site,
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
    sitemap({
      filter: (page: string) =>
        page !== `${site}/400` &&
        page !== `${site}/403` &&
        page !== `${site}/422` &&
        page !== `${site}/429` &&
        !page.startsWith(`${site}/api`) &&
        !page.startsWith(`${site}/auth`) &&
        !page.startsWith(`${site}/user/`) &&
        !page.startsWith(`${site}/cart`) &&
        !page.startsWith(`${site}/checkout`),
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
