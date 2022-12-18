import { GeneralError } from 'zapnode'
import { App } from '../declarations'

import Hello from './hello'
import Status from './status'

const beforeFind = (ctx: any) => {
  const page = parseInt(ctx.params.query.page)

  if (page > 1) {
    throw new GeneralError('Max page is 1')
  }
}

const addDate = (ctx: any) => {
  ctx.result = ctx.result.map(item => ({ ...item, date: new Date() }))
}

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
        find: [beforeFind]
      },
      after: {
        find: [addDate, addMsg],
        get: [addMsg]
      }
    }
  })

  app.addService('status', new Status(app.config), {
    hooks: {}
  })
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type MyServices = {
  hello: Hello
  status: Status
}

export default registerServices
