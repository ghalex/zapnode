import { App } from '@/declarations'
import UsersClass from './users.class'
import { userDataResolver, userResultResolver } from './users.schema'
import { dataHook, resultHook } from 'zapnode-plugins'
import { authenticate } from 'zapnode-auth'

export const registerUsers = async (app: App) => {
  const db = await app.db
  const collection = db.collection('users')
  // const users = await collection.find().toArray()
  // console.log(users)

  app.addService('users', new UsersClass(collection), {
    hooks: {
      before: {
        find: [authenticate()],
        get: [authenticate()],
        update: [authenticate()],
        patch: [authenticate()],
        remove: [authenticate()],
        create: [dataHook(userDataResolver)]
      },
      after: {
        all: [resultHook(userResultResolver)]
      }
    }
  })
}

declare module '../../declarations' {
  // eslint-disable-next-line no-unused-vars
  interface MyServices {
    users: UsersClass
  }
}
