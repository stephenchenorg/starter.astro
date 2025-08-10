export async function GET() {
  const isDev = import.meta.env.DEV
  const siteUrl = import.meta.env.SITE

  const robotsTxt = isDev
    // Development environment robots.txt
    ? `
# Development Environment - Block All Crawlers
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
