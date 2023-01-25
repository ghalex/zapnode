
import { Params } from 'zapnode'
import { ConfigData } from '@/declarations'

class AuthClass {
  constructor (protected config: ConfigData) {}

  async find (params?: Params) {
    return {
      host: this.config.host,
      port: this.config.port,
      version: this.config.version
    }
  }
}

export default AuthClass
