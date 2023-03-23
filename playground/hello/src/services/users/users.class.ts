import { Params } from 'zapnode'
import { MongoDBService } from 'zapnode-data'
import { User, UserData, UserQuery } from './users.schema'

class UsersClass extends MongoDBService<User, UserData, Params<UserQuery>> {
}

export default UsersClass
