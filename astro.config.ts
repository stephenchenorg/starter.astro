import netlify from '@astrojs/netlify'
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import icons from 'unplugin-icons/vite'
import { loadEnv } from 'vite'

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')
const site = env.SITE_URL || process.env.SITE_URL || 'http://localhost:4321'
const siteUrl = new URL(site)
const isNetlify = process.env.is_netlify === 'true'

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
    // Astro 5.14+ host header 驗證：未設定 allowedDomains 時，
    // host 會被視為不可信並 fallback 到 localhost，導致 src/middleware/originCheck.ts
    // 的 same-origin 比對失敗，prod 同源表單提交全被擋 (Cross-site form submissions are forbidden)
    allowedDomains: [
      {
        hostname: siteUrl.hostname,
        protocol: siteUrl.protocol.replace(':', ''),
        ...(siteUrl.port ? { port: siteUrl.port } : {}),
      },
    ],
    // Change built-in origin check to custom function
    // @see src/middleware.ts
    checkOrigin: false,
  },
})
