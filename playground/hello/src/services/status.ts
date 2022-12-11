
import { ConfigData } from '../declarations'
import { Params } from 'zapnode'

class Status {
  constructor (protected config: ConfigData) {}

  async find (params?: Params) {
    return {
      host: this.config.host,
      port: this.config.port,
      version: this.config.version
    }
  }
}

export default Status
