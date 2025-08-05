/**
 * @reference https://github.com/withastro/astro/blob/d2d04b02773f82103db75076fcdd1f089503770a/packages/astro/src/core/app/middlewares.ts
 */

import { defineMiddleware } from 'astro/middleware'
import siteConfig from '@/site.config'

/**
 * Content types that can be passed when sending a request via a form
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/enctype
 * @private
 */
const FORM_CONTENT_TYPES = [
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'text/plain',
]

// Note: TRACE is unsupported by undici/Node.js
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

const API_ORIGIN = new URL(siteConfig.apiBaseUrl).origin
const ALLOWED_ORIGINS = [API_ORIGIN]

const EXCLUDE_PATHS = [
  '/checkout/done',
]

/**
 * Returns a middleware function in charge to check the `origin` header.
 */
export const originCheck = defineMiddleware((context, next) => {
  const { request, url, isPrerendered } = context
  // Prerendered pages should be excluded
  if (isPrerendered) {
    return next()
  }
  // Safe methods don't require origin check
  if (SAFE_METHODS.includes(request.method)) {
    return next()
  }
  // Exclude specific paths from origin check
  if (EXCLUDE_PATHS.includes(url.pathname)) {
    return next()
  }

  const isSameOrigin = request.headers.get('origin') === url.origin

  // Add check for allowed origins
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(request.headers.get('origin') || '')

  const hasContentType = request.headers.has('content-type')
  if (hasContentType) {
    const formLikeHeader = hasFormLikeHeader(request.headers.get('content-type'))
    if (formLikeHeader && !isSameOrigin && !isAllowedOrigin) {
      return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
        status: 403,
      })
    }
  } else {
    if (!isSameOrigin && !isAllowedOrigin) {
      return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
        status: 403,
      })
    }
  }

  return next()
})

function hasFormLikeHeader(contentType: string | null): boolean {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) {
      if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) {
        return true
      }
    }
  }
  return false
}
