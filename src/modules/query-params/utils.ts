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

export function cleanParams(params: Record<string, any>, defaultParams: Record<string, any>) {
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
