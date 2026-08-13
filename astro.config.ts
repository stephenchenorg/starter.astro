import netlify from '@astrojs/netlify'
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import icons from 'unplugin-icons/vite'
import { loadEnv } from 'vite'

// astro.config.ts 會在 Vite 載入 .env 之前就被求值，process.env 不會自動帶入 .env 內容
// （見 vite-load.js 內部只用 configFile: false 的裸 Vite server 來 SSR 這個檔案，不會跑一般的 env 載入流程）
// 因此需要自行呼叫 loadEnv 讀檔；process.env 仍優先，讓 Netlify/Vercel/PM2 等平台注入的真實環境變數可以覆蓋 .env
// @see https://vite.dev/config/#using-environment-variables-in-config
function resolveMode() {
  const modeFlagIndex = process.argv.indexOf('--mode')
  if (modeFlagIndex !== -1 && process.argv[modeFlagIndex + 1])
    return process.argv[modeFlagIndex + 1]

  return process.argv.includes('dev') ? 'development' : 'production'
}

const fileEnv = loadEnv(resolveMode(), process.cwd(), '')
const site = process.env.SITE_URL || fileEnv.SITE_URL
const { hostname, protocol, port } = new URL(site)
const isNetlify = (process.env.is_netlify || fileEnv.is_netlify) === 'true'

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
        hostname,
        protocol: protocol.replace(':', ''),
        ...(port ? { port } : {}),
      },
    ],
    // Change built-in origin check to custom function
    // @see src/middleware.ts
    checkOrigin: false,
  },
})
