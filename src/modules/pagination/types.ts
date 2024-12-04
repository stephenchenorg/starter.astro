export interface Paginator<T> {
  total: number
  per_page: number
  data: T[]
}
