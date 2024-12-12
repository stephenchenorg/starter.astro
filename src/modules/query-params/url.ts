import { urlConfigStore } from './store'
import { cleanParams, mergeUrlParams, createUrlWithParams } from './utils'
import type { UrlConfig } from './types'

export interface QueryParamsUrlOptions {
  transformParams?: (params: Record<string, any>) => Record<string, any>
}

export function queryParamsUrl(
  additionalParams: Record<string, any>,
  urlConfig: UrlConfig = {
    baseUrl: '',
    params: {},
    defaultParams: {},
  },
  options: QueryParamsUrlOptions = {}
) {
  const { transformParams } = options

  const config = typeof window !== 'undefined'
    ? urlConfigStore.get()
    : urlConfig

  let params = mergeUrlParams(config.params, additionalParams)
  if (transformParams) {
    params = transformParams(params)
  }
  const cleanedParams = cleanParams(params, config.defaultParams || {})

  return createUrlWithParams(config.baseUrl, cleanedParams)
}
