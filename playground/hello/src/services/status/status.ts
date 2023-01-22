import { App } from '@/declarations'

import StatusClass from './status.class'

export const registerStatus = async (app: App) => {
  app.addService('status', new StatusClass(app.config), {
    hooks: {
      before: {
        find: []
      },
      after: {
        all: []
      }
    },
    customMethods: {
      say: { path: 'say' }
    },
    customPath: '/'
  })
}

declare module '../../declarations' {
  // eslint-disable-next-line no-unused-vars
  interface MyServices {
    status: StatusClass
  }
}
