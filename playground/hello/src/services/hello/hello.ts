import { App } from '@/declarations'

import HelloClass from './hello.class'

const addMsg = (ctx: any) => {
  const fn = (item: any) => ({ ...item, msg: `Welcome ${item.name as string}` })

  if (Array.isArray(ctx.result)) {
    ctx.result = ctx.result.map(fn)
  } else {
    ctx.result = fn(ctx.result)
  }
}

export const registerHello = async (app: App) => {
  app.addService('hello', new HelloClass(), {
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
    hello: HelloClass
  }
}
