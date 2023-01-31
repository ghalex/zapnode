
import { Paginated, Params, Service } from 'zapnode'
import { ConfigData } from '@/declarations'

class StatusClass implements Service {
  constructor (protected config: ConfigData) {}

  async find (params?: Params): Promise<any[]>
  async find (params?: Params & { query: { $paginate: true } }): Promise<Paginated<any>>
  async find (params?: Params): Promise<Paginated<any> | any> {
    return [{
      host: this.config.host,
      port: this.config.port,
      version: this.config.version
    }]
  }
}

export default StatusClass
