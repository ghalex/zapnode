import { Id, Params } from 'zapnode'
import { people } from '@/mock'

interface Query {
  name: string
}

interface MyParams extends Params<Query> {}

class HelloClass {
  private readonly data = people

  async find (params?: Params) {
    return this.data
  }

  async get (id: Id, params?: MyParams) {
    return this.data.find(x => x.id.toString() === id)
  }

  async say (data: any, params?: Params) {
    return { hi: 'Welcome' }
  }
}

export default HelloClass
