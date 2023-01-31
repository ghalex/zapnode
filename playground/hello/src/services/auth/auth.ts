import { App } from '@/declarations'
import { AuthService, LocalStrategy } from 'zapnode-auth'

export const registerAuth = async (app: App) => {
  const service = new AuthService(app)
  service.addStrategy('local', new LocalStrategy())

  app.addService('auth', service, {})
}

declare module '../../declarations' {
  // eslint-disable-next-line no-unused-vars
  interface MyServices {
    auth: AuthService
  }
}
