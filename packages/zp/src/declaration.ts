import { Application } from './app'

export interface Plugin<A = any> {
  name: string
  init: (app: A) => void
}

export type Id = number | string
export type NullableId = Id | null
export interface Query {
  [key: string]: any
}

export interface Params<Q = Query> {
  query?: Q
  provider?: string
  route?: {
    [key: string]: any
  }
  headers?: {
    [key: string]: any
  }
  user?: any
  authenticated?: boolean
}

export interface Paginated<R> {
  total: number
  limit?: number
  skip: number
  data: R[]
}

export interface Service<Result = any, Data = Partial<Result>, ServiceParams extends Params = any> {
  find? (params?: ServiceParams): Promise<Result[]>
  find? (params?: ServiceParams & { query: { $paginate: true } }): Promise<Paginated<Result>>
  find? (params?: ServiceParams): Promise<Paginated<Result> | Result[]>

  create? (data: Data, params?: ServiceParams): Promise<Result>
  create? (data: Data[], params?: ServiceParams): Promise<Result[]>

  patch? (id: null, data: Data, params?: ServiceParams): Promise<Result[]>
  patch? (id: Id, data: Data, params?: ServiceParams): Promise<Result>

  remove? (id: null, params?: ServiceParams): Promise<Result[]>
  remove? (id: Id, params?: ServiceParams): Promise<Result>

  get? (id: Id, params?: ServiceParams): Promise<Result>
  update? (id: Id, data: Data, params?: ServiceParams): Promise<Result>
}

export { Application }
