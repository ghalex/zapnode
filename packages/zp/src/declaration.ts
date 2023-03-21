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

export interface Service<Result = any, Data = any, ServiceParams extends Params = any> {
  find? (params?: ServiceParams): Promise<Paginated<Result> | Result[]>
  create? (data: Data | Data[], params?: ServiceParams): Promise<Result | Result[]>
  patch? (id: Id | null, data: Data, params?: ServiceParams): Promise<Result | Result[]>
  remove? (id: Id | null, params?: ServiceParams): Promise<Result | Result[]>
  get? (id: Id, params?: ServiceParams): Promise<Result>
  update? (id: Id, data: Data, params?: ServiceParams): Promise<Result>
}

export { Application }
