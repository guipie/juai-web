declare namespace JuApp {
  type LoadStatus = 'initialLoading' | 'loading' | 'nomore' | 'load' | 'error'

  interface Paging {
    hasNextPage: boolean
    hasPrevPage: boolean
    items: any[]
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
