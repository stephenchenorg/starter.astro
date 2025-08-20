import { defineMiddleware } from 'astro/middleware'
import picomatch from 'picomatch'
// import { getSession } from '@/sessions'

// guest only: 只能由訪客訪問的路徑
const GUEST_URLS = [
  '/login',
  '/register',
]

export const guest = defineMiddleware(async ({ url, redirect }, next) => {
  // const session = getSession(cookies)
  const isLoggedIn = false
  // const isLoggedIn = !!session.userToken?.token

  if (picomatch.isMatch(url.pathname, GUEST_URLS) && isLoggedIn) {
    return redirect('/')
  }

  return next()
})
