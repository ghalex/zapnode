/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NullableId, Params } from 'zapnode'
import { MongoDBService } from 'zapnode-data'

interface User {
  email: string
  name: string
}

interface Query {
}

interface UsersParams extends Params<Query> {}

class UsersClass extends MongoDBService<User> {
}

export default UsersClass
