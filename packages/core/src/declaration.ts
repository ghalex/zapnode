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
}

export interface ServiceMethods<T = any, D = Partial<T>, P = Params> {
  find?: (params?: P) => Promise<T | T[]>
  get?: (id: Id, params?: P) => Promise<T>
  create?: (data: D, params?: P) => Promise<T>
  update?: (id: NullableId, data: D, params?: P) => Promise<T | T[]>
  patch?: (id: NullableId, data: D, params?: P) => Promise<T | T[]>
  remove?: (id: NullableId, params?: P) => Promise<T | T[]>
}

export type Service<T = any, D = Partial<T>, P = Params> = ServiceMethods<T, D, P>
export { Application }
