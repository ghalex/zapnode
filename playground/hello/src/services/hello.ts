import { Id, Params } from 'zapnode'
import { people } from '../mock'

class Hello {
  private readonly data = people

  async find (params?: Params) {
    return this.data
  }

  async get (id: Id, params?: Params) {
    console.log('id', id)
    return this.data.find(x => x.id.toString() === id)
  }
}

export default Hello
