import { GeneralError } from 'zapnode'
import { App } from '../declarations'

import Hello from './hello'
import Status from './status'

// const beforeFind = (ctx: any) => {
//   const page = parseInt(ctx.params.query.page)

//   if (page > 1) {
//     throw new GeneralError('Max page is 1')
//   }
// }

// const addDate = (ctx: any) => {
//   const fn = item => ({ ...item, date: new Date() })

//   if (Array.isArray(ctx.result)) {
//     ctx.result = ctx.result.map(fn)
//   } else {
//     ctx.result = fn(ctx.result)
//   }
// }

const addMsg = (ctx: any) => {
  const fn = (item: any) => ({ ...item, msg: `Welcome ${item.name as string}` })

  if (Array.isArray(ctx.result)) {
    ctx.result = ctx.result.map(fn)
  } else {
    ctx.result = fn(ctx.result)
  }
}

const registerServices = (app: App) => {
  app.addService('hello', new Hello(), {
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

  app.addService('status', new Status(app.config), {
    hooks: {},
    customPath: '/'
  })
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type MyServices = {
  hello: Hello
  status: Status
}

export default registerServices
