import { App } from '@/declarations'
import { resolve } from 'zapnode'
import { HookContext } from 'zapnode-plugins'

export interface User {
  _id: string
  email: string
  name: string
  password: string
  createdAt: Date
}

export interface UserData {
  email: string
  name: string
  password: string
}

export interface UserQuery {
  _id: string
  email: string
}

export const userDataResolver = resolve<User, HookContext<App>>({
  // The password should never be visible externally
  password: async (val, data, { app }) => {
    if (val) {
      return app.services.auth.hashPassword(val, 'local')
    }

    return val
  },
  createdAt: async (val, data, ctx) => {
    if (ctx.method === 'create') {
      return new Date()
    }

    return val
  }
})

export const userResultResolver = resolve<User, HookContext>({
  // The password should never be visible externally
  password: async () => undefined
})

export const userQueryResolver = resolve<UserQuery, HookContext>({
  _id: async (val, user, { params }) => {
    // if (params.user) {
    //   return params.user._id
    // }

    return val
  }
})
