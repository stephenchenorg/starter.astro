import { defineMiddleware } from 'astro/middleware'
import picomatch from 'picomatch'
import { getSession } from '@/sessions'

// auth only: 只能由已登錄用戶訪問的路徑
const AUTH_URLS = [
  '/dashboard',
  '/settings/**',
]

export const auth = defineMiddleware(async ({ url, redirect, cookies }, next) => {
  const session = getSession(cookies)
  const isLoggedIn = !!session.userToken?.token

  if (picomatch.isMatch(url.pathname, AUTH_URLS) && !isLoggedIn) {
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    return redirect(`/auth/login?redirect_to=${encodeURIComponent(url.pathname)}`)
  }

  return next()
})
