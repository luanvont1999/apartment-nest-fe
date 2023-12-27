export interface ListPagination<T> {
  data: Array<T>
  total: number
  page: number
  perPage: number
}

export interface IPost {
  id: number
  title: string
  content: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}
