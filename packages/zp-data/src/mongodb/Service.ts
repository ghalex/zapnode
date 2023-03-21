/* eslint-disable @typescript-eslint/method-signature-style */
/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { Id, NullableId, Paginated, Params, Service } from 'zapnode'
import { Collection } from 'mongodb'
import MongoDBRepository from './Repository'

class MongoDBService<Result = any, Data = any, ServiceParams extends Params = any> implements Service<Result, Data, ServiceParams> {
  protected repository: MongoDBRepository<Result, Data, ServiceParams>

  constructor (collection: Collection) {
    if (collection === undefined) {
      throw new Error('MongoDB collection have to be provided')
    }

    this.repository = new MongoDBRepository<Result, Data, ServiceParams>(collection)
  }

  async find (params?: ServiceParams): Promise<Paginated<Result> | Result[]> {
    return this.repository.find(params)
  }

  async get (id: Id, params?: ServiceParams): Promise<Result> {
    return this.repository.get(id, params)
  }

  async update (id: Id, data: Data, params?: ServiceParams): Promise<Result> {
    return this.repository.update(id, data, params)
  }

  async create (data: Data | Data[], params?: ServiceParams): Promise<Result | Result[]> {
    return this.repository.create(data, params)
  }

  async patch (id: NullableId, data: Data, params?: ServiceParams): Promise<Result | Result[]> {
    return this.repository.patch(id, data, params)
  }

  async remove (id: NullableId, params?: ServiceParams): Promise<Result | Result[]> {
    return this.repository.remove(id, params)
  }
}

export default MongoDBService
