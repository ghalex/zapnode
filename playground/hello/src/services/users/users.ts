import { App } from '@/declarations'

import UsersClass from './users.class'

const addMsg = (ctx: any) => {
  const fn = (item: any) => ({ ...item, msg: `Welcome ${item.name as string}` })
  const { method, result } = ctx

  if (method === 'find') {
    ctx.result = { ...result, data: result.data.map(fn) }
    return
  }

  if (Array.isArray(result)) {
    ctx.result = result.map(fn)
    return
  }

  ctx.result = fn(result)
}

export const registerUsers = async (app: App) => {
  const db = await app.db
  const collection = db.collection('users')
  // const users = await collection.find().toArray()
  // console.log(users)

  app.addService('users', new UsersClass(collection), {
    hooks: {
      before: {
        find: []
      },
      after: {
        all: [addMsg]
      }
    },
    customMethods: {
      say: { path: 'say' }
    }
  })
}

declare module '../../declarations' {
  // eslint-disable-next-line no-unused-vars
  interface MyServices {
    users: UsersClass
  }
}
