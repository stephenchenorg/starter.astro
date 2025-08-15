import type { FormErrors } from '@stephenchenorg/astro/form-validator'
import type { AstroCookies, AstroCookieSetOptions } from 'astro'
import type { SessionUser, UserToken } from '@/types'
import { createCookieSessionStorage } from 'astro-cookie-session'

// Session 資料類型
interface SessionData {
  user: SessionUser
  userToken: UserToken
}

// Flash 資料類型
interface FlashData {
  errors: FormErrors
  old: Record<string, any>
}

// Cookie Session 設定
const cookieName = 'astro.session'
const cookieSetOptions: AstroCookieSetOptions = {
  httpOnly: true,
  secure: import.meta.env.PROD,
  path: '/',
  maxAge: 120 * 60, // 2 hours
  sameSite: 'lax',
}

export const { getSession } = createCookieSessionStorage<SessionData, FlashData>({
  cookieName,
  cookieSetOptions,
})

// 重設 Session
export function resetSession(cookies: AstroCookies) {
  const cookieDeleteOptions = { ...cookieSetOptions }
  delete cookieDeleteOptions.expires
  delete cookieDeleteOptions.maxAge
  delete cookieDeleteOptions.encode

  cookies.delete(cookieName, cookieDeleteOptions)
}
