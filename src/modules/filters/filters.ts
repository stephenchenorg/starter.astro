import { filtersStore, defaultFiltersStore } from './stores'
import { urlWithParams, mergeUrlParams } from '@/modules/url'

export function filtersUrl(url: string, filterParams: Record<string, any>) {
  const filters = filtersStore.get()
  const defaultFilters = defaultFiltersStore.get()
  const params = cleanFilters(mergeUrlParams(filters, filterParams), defaultFilters)
  return urlWithParams(url, params)
}

export function cleanFilters(filters: Record<string, any>, defaultFilters: Record<string, any>) {
  const newFilters: Record<string, any> = JSON.parse(JSON.stringify(filters))

  Object.keys(newFilters).forEach(key => {
    if (
      Object.keys(defaultFilters).includes(key) &&
      newFilters[key] === defaultFilters[key]
    ) {
      newFilters[key] = null
    }
  })

  return newFilters
}
