import { atom } from 'nanostores'
import type { UrlConfig } from './types'

export const urlConfigStore = atom<UrlConfig>({
  baseUrl: '',
  params: {},
  defaultParams: {},
})
