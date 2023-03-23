
import { Params, Service } from 'zapnode'
import { ConfigData } from '@/declarations'

class StatusClass implements Service {
  constructor (protected config: ConfigData) {}

  async find (params?: Params): Promise<any> {
    return {
      host: this.config.host,
      port: this.config.port,
      version: this.config.version
    }
  }
}

export default StatusClass
