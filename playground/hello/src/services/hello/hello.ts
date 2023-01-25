import { resultHook } from 'zapnode-plugins'
import { App } from '@/declarations'

import HelloClass from './hello.class'
import { helloResolver } from './hello.schema'
import { authenticate } from 'zapnode-auth'

// const myHook = async (ctx: HookContext) => {
//   ctx.result = await Promise.all(ctx.result.map(async (item) => await yearResolver.resolve(item, ctx)))
// }

export const registerHello = async (app: App) => {
  app.addService('hello', new HelloClass(), {
    hooks: {
      before: {
        all: [authenticate()]
      },
      after: {
        find: [resultHook(helloResolver)],
        get: [resultHook(helloResolver)]
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
