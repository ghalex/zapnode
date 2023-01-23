import { Params, resolve } from 'zapnode'
import { HookContext } from 'zapnode-plugins'

export interface Hello {
  id: number
  name: string
  age: number
  year?: number
  msg: string
}

export interface HelloQuery {
  name: string
}

export interface HelloParams extends Params<HelloQuery> {}

export const helloResolver = resolve<Hello, HookContext>({
  year: async (value, obj, ctx) => {
    const todayYear = new Date().getFullYear()

    return todayYear - obj.age
  },
  msg: async (value, obj, ctx) => {
    return 'Welcome ' + obj.name
  }
})
