import { Paginated, Params } from 'zapnode'
import { MongoDBService } from 'zapnode-data'
import { User, UserData, UserQuery } from './users.schema'

class UsersClass extends MongoDBService<User, UserData, Params<UserQuery>> {
  async find (params?: Params<UserQuery>): Promise<User[]>
  async find (params?: Params<UserQuery> & { query: { $paginate: true } }): Promise<Paginated<User>>
  async find (params?: Params<UserQuery>): Promise<Paginated<User> | User[]> {
    return this.repository.find(params)
  }
}

export default UsersClass
