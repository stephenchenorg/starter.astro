import { defineMiddleware } from 'astro/middleware'
import { handleErrorResponse } from '@stephenchenorg/astro/api'

export const onRequest = defineMiddleware(async (_context, next) => {
  try {
    return await next()
  } catch (e) {
    const response = handleErrorResponse(e)
    if (response) {
      return response
    }

    throw e
  }
})
