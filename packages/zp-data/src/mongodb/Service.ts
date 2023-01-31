/* eslint-disable @typescript-eslint/method-signature-style */
/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { Id, NullableId, Paginated, Params, Service } from 'zapnode'
import { Collection } from 'mongodb'
import MongoDBRepository from './Repository'

class MongoDBService<Result = any, Data = Partial<Result>, ServiceParams extends Params<any> = any> implements Service<Result, Data, ServiceParams> {
  protected repository: MongoDBRepository<Result, Data, ServiceParams>

  constructor (collection: Collection) {
    if (collection === undefined) {
      throw new Error('MongoDB collection have to be provided')
    }

    this.repository = new MongoDBRepository<Result, Data, ServiceParams>(collection)
  }

  async find (params?: ServiceParams): Promise<Result[]>
  async find (params?: ServiceParams & { query: { $paginate: true } }): Promise<Paginated<Result>>
  async find (params?: ServiceParams): Promise<Paginated<Result> | Result[]> {
    return this.repository.find(params)
  }

  async get (id: Id, params: ServiceParams = {} as ServiceParams): Promise<Result> {
    return this.repository.get(id, params)
  }

  async update (id: Id, data: Data, params?: ServiceParams): Promise<Result> {
    return this.repository.update(id, data, params)
  }

  async create (data: Data, params?: ServiceParams): Promise<Result>
  async create (data: Data[], params?: ServiceParams): Promise<Result[]>
  async create (data: Data | Data[], params: ServiceParams = {} as ServiceParams): Promise<Result | Result[]> {
    return this.repository.create(data, params)
  }

  async patch (id: null, data: Data, params?: ServiceParams): Promise<Result[]>
  async patch (id: Id, data: Data, params?: ServiceParams): Promise<Result>
  async patch (id: NullableId, data: Data, params?: ServiceParams): Promise<Result | Result[]> {
    return this.repository.patch(id, data, params)
  }

  async remove (id: null, params?: ServiceParams): Promise<Result[]>
  async remove (id: Id, params?: ServiceParams): Promise<Result>
  async remove (id: NullableId, params?: ServiceParams): Promise<Result | Result[]> {
    return this.repository.remove(id, params)
  }
}

export default MongoDBService
