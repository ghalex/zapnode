import { Id } from 'zapnode'
import { people } from '@/mock'
import { HelloParams } from './hello.schema'

class HelloClass {
  private readonly data = people

  async find (params?: HelloParams): Promise<any> {
    return {
      total: 3,
      skip: 0,
      data: people
    }
  }

  async get (id: Id, params?: HelloParams) {
    return this.data.find(x => x.id.toString() === id)
  }

  async say (data: any, params?: HelloParams) {
    return { hi: 'Welcome' }
  }
}

export default HelloClass
