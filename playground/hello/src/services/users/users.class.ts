/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NullableId, Params } from 'zapnode'
import { MongoDBService } from 'zapnode-data'
import { User, UserData } from './users.schema'

interface Query {
}

interface UsersParams extends Params<Query> {}

class UsersClass extends MongoDBService<User> {
  async find (params?: UsersParams) {
    console.log('q=', params?.query)
    return this.$find(params)
  }

  async create (data: UserData, params?: UsersParams) {
    return this.$create(data, params)
  }
}

export default UsersClass
