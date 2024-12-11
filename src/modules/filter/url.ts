import { filterParamsStore, defaultFilterParamsStore } from './stores'
import { urlWithParams, mergeUrlParams } from '@/modules/url'

export function filterUrl(url: string, additionalParams: Record<string, any>) {
  const params = filterParamsStore.get()
  const defaultParams = defaultFilterParamsStore.get()
  const cleanedParams = cleanFilterParams(mergeUrlParams(params, additionalParams), defaultParams)
  return urlWithParams(url, cleanedParams)
}

export function cleanFilterParams(params: Record<string, any>, defaultParams: Record<string, any>) {
  const newParams: Record<string, any> = JSON.parse(JSON.stringify(params))

  Object.keys(newParams).forEach(key => {
    if (
      Object.keys(defaultParams).includes(key) &&
      newParams[key] === defaultParams[key]
    ) {
      newParams[key] = null
    }
  })

  return newParams
}
