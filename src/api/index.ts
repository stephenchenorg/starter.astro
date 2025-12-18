import type { APIContext } from 'astro'
import type { FetchOptions, MappedResponseType, ResponseType } from 'ofetch'
import { ofetch } from 'ofetch'
import siteConfig from '@/site.config'

export async function apiFetch<T = any, R extends ResponseType = 'json'>(
  url: string,
  userOptions: FetchOptions<R> & { Astro?: APIContext } = {}
): Promise<MappedResponseType<R, T>> {
  const { Astro: astroContext, ...options } = userOptions

  const response = await ofetch(url, {
    baseURL: siteConfig.apiBaseUrl,
    ...options,
    async onRequest({ request, options }) {
      options.headers.set('Content-Language', 'zh-TW')
      options.headers.set('Time-Zone', 'Asia/Taipei')
      options.headers.set('Referer', 'https://dentalk.com.tw/')

      // if (userToken?.token) {
      //   options.headers.set('Authorization', `Bearer ${userToken.token}`)
      // }
    },
  })

  return response
}
