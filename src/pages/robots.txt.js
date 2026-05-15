/**
 * robots.txt - 搜尋引擎爬蟲控制檔案
 *
 * ## 什麼是 robots.txt？
 * 給搜尋引擎爬蟲看的「告示牌」，告訴它們哪些頁面可以爬、哪些不行。
 * 當 Google/Bing 爬蟲要爬網站時，第一件事就是先看 /robots.txt。
 *
 * ## 語法說明
 * - `User-agent: *` — 適用於所有爬蟲
 * - `User-agent: Googlebot` — 只適用於 Google 爬蟲
 * - `Allow: /` — 允許爬取整個網站
 * - `Disallow: /` — 禁止爬取整個網站
 * - `Disallow: /admin/` — 禁止爬取 /admin/ 路徑
 * - `Sitemap: URL` — 告訴爬蟲 sitemap 位置
 *
 * ## 重要觀念
 * - 這是「君子協定」，正規爬蟲（Google、Bing）會遵守，惡意爬蟲可能無視
 * - 不是密碼保護，只是「請不要進來」的告示
 * - 所以還需要搭配 noindex meta tag 作為多層保護
 *
 * ## 環境判斷
 * - 使用 MODE 而非 DEV，確保 staging 環境也會被阻擋
 * - DEV 只在 yarn dev 時為 true，build 後永遠是 false
 */
export async function GET() {
  const isProduction = import.meta.env.MODE === 'production'
  const siteUrl = import.meta.env.SITE

  const robotsTxt = !isProduction
    // Non-production environment robots.txt (dev, staging, etc.)
    ? `
# Non-Production Environment - Block All Crawlers
User-agent: *
Disallow: /
`
    // Production environment robots.txt
    : `
# Allow all search engines to crawl the site
User-agent: *
Allow: /

# Block crawling of admin/sensitive areas
Disallow: /api/
Disallow: /_astro/
Disallow: /admin/
Disallow: /.netlify/
Disallow: /preview/

# Block specific files
Disallow: /*.pdf$
Disallow: /private/

# Special rules for common bots
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-index.xml

# Additional metadata
# Host: ${siteUrl.replace('https://', '')}
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  })
}
