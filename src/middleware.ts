import { defineMiddleware } from 'astro/middleware'
import { GraphQLRequestError } from '@stephenchenorg/astro/api'

export const onRequest = defineMiddleware(async (_context, next) => {
  try {
    return await next()
  } catch (e) {
    // Handle 404 errors
    if (e instanceof GraphQLRequestError && e.isNotFound()) {
      return new Response(null, {
        status: 404,
        statusText: 'Not found',
      })
    }

    throw e
  }
})
