import type { APIContext } from 'astro'
import type { FetchOptions, MappedResponseType, ResponseType } from 'ofetch'
import { ofetch } from 'ofetch'
import siteConfig from '@/site.config'

// 內外網分流，詳見 README「API 網域設定」章節
// SSR（伺服器對伺服器）呼叫優先走內網 API_BASE_URL，加速並避開公開網路；未設定時 fallback 回 siteConfig.apiBaseUrl
// 瀏覽器端固定走 siteConfig.apiBaseUrl（公開網域）——SSR 判斷是建置時就定案的靜態分支，內網位址不會出現在瀏覽器端 bundle 裡
const baseURL = import.meta.env.SSR
  ? (import.meta.env.API_BASE_URL?.replace(/\/$/, '') || siteConfig.apiBaseUrl)
  : siteConfig.apiBaseUrl

export async function apiFetch<T = any, R extends ResponseType = 'json'>(
  url: string,
  userOptions: FetchOptions<R> & { Astro?: APIContext } = {}
): Promise<MappedResponseType<R, T>> {
  const { Astro: astroContext, ...options } = userOptions

  const response = await ofetch(url, {
    baseURL,
    ...options,
    async onRequest({ request, options }) {
      // 默認使用 zh_TW, 因為後端也是用 zh_TW, 雖然前端是使用 BCP 47 國際標準，html 的 lang 是使用 zh-TW ( 不是下底線 ）
      // 但語系因為跟著後端走，所以記得其他語系也是如此
      options.headers.set('Content-Language', 'zh_TW')
      options.headers.set('Time-Zone', 'Asia/Taipei')
      options.headers.set('Referer', 'https://dentalk.com.tw/')

      // if (userToken?.token) {
      //   options.headers.set('Authorization', `Bearer ${userToken.token}`)
      // }
    },
  })

  return response
}
