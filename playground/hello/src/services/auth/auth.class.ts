
// import { Params } from 'zapnode'
import { App } from '@/declarations'
import { LocalStrategy } from 'zapnode-auth'

export interface AuthData {
  strategy?: string
  email: string
  password: string
}

class AuthClass {
  protected strategy: LocalStrategy

  constructor (protected app: App) {
    this.strategy = new LocalStrategy(app)
  }

  async login (data: AuthData) {
    const res = await this.strategy.authenticate(data)
    // const res = await this.strategy.hashPassword('1234')
    return { res }
  }
}

export default AuthClass
