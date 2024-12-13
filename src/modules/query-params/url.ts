import qs from 'query-string'
import { urlConfigStore } from './store'
import { cleanParams, mergeUrlParams } from './utils'
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

  const queryString = qs.stringify(cleanedParams, {
    skipEmptyString: true,
    skipNull: true,
    sort: false,
  })

  return `${config.baseUrl}${queryString ? '?' : ''}${queryString}`
}

export function parseQueryParams(search: string) {
  return qs.parse(search)
}
