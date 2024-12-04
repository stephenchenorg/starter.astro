export function usePagination(options: {
  total: number
  currentPage: number
  url: string
  perPage?: number
  visiblePages?: number
}) {
  const {
    total,
    currentPage,
    perPage = 12,
  } = options

  const items = []
  const totalPages = Math.ceil(total / perPage)
  const visiblePages = Math.min(options.visiblePages || 5, totalPages)
  const sideCount = Math.floor(visiblePages / 2)

  let start = Math.max(1, currentPage - sideCount)
  let end = Math.min(totalPages, currentPage + sideCount)

  if (end - start + 1 < visiblePages && currentPage > 0) {
    if (currentPage <= sideCount) {
      end = Math.min(totalPages, start + visiblePages - 1)
    } else if (currentPage > totalPages - sideCount) {
      start = Math.max(1, end - visiblePages + 1)
    }
  }

  for (let i = start; i <= end; i++) {
    items.push(i)
  }

  function getUrl(page: number) {
    const url = new URL(options.url)
    url.searchParams.set('page', String(page))
    return url.toString()
  }

  return {
    items,
    showPagination: total > perPage,
    currentPage,
    canFirst: currentPage > 1,
    canPrev: currentPage > 1,
    canNext: currentPage < totalPages,
    canLast: currentPage < totalPages,
    firstUrl: getUrl(1),
    prevUrl: getUrl(currentPage - 1),
    nextUrl: getUrl(currentPage + 1),
    lastUrl: getUrl(totalPages),
    getUrl,
  }
}
