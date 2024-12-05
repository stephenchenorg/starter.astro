export function urlWithParams(url: string, params: Record<string, any>, baseParams?: Record<string, any>) {
  const paramsString = urlParams(params, baseParams)
  return `${url}${paramsString ? '?' : ''}${paramsString}`
}

export function urlParams(params: Record<string, any>, baseParams?: Record<string, any>) {
  let resultParams = baseParams
    ? mergeUrlParams(baseParams, params)
    : params

  return Object.entries(resultParams)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${key}=${encodeURIComponent(v)}`).join('&')
      } else if (value) {
        return `${key}=${encodeURIComponent(value)}`
      }
    })
    .filter(Boolean)
    .join('&')
}

export function mergeUrlParams<
  Params extends Record<string, any> = Record<string, any>
>(baseParams: Params, userParams: Partial<Params>): Params {
  return Object
    .keys(baseParams)
    .reduce((result, key) => {
      if (Array.isArray(baseParams[key])) {
        result[key] = Array.from(new Set([...baseParams[key], ...(userParams[key] || [])]))
      } else {
        result[key] = typeof userParams[key] !== 'undefined' ? userParams[key] : baseParams[key]
      }
      return result
    }, {} as Record<string, any>) as Params
}
