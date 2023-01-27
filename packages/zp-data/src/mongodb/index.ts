/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Id, NullableId, Params, Query, Service } from 'zapnode'
import { Collection, ObjectId } from 'mongodb'
import { omit, pick } from 'ramda'

interface Options {
  query: any
  options: any
  filters: {
    $sort?: { [key: string]: 1 | -1 }
    $limit?: number
    $skip?: number
    $select?: string[]
  }
}

class MongoDBService<M = any, D = Partial<M>> implements Service<M, D> {
  protected collection: Collection
  protected keys = ['$sort', '$limit', '$skip', '$select']

  constructor (collection: Collection) {
    if (collection === undefined) {
      throw new Error('MongoDB collection have to be provided')
    }

    this.collection = collection
  }

  protected $objectifyId (id: any) {
    if (ObjectId.isValid(id)) {
      id = new ObjectId(id.toString())
    }

    return id
  }

  protected $options (params: any = {}): Options {
    const filters = pick(this.keys, params.query ?? {})
    const query = omit(this.keys, params.query ?? {})
    const options = Object.assign({}, params.options)

    return { filters, query, options }
  }

  protected async $get (id: Id, params?: Params): Promise<M> {
    const { query, options } = this.$options(params)
    const fields = params?.query?.$select

    if (query._id) {
      query._id = this.$objectifyId(query._id)
    } else {
      query._id = this.$objectifyId(id)
    }

    const data = await this.collection.findOne(query, options)

    if (!data) {
      throw new Error(`No record found for id '${id}'`)
    }

    if (fields) {
      return pick(['_id', ...fields], data) as M
    }

    return data as M
  }

  protected async $find (params: Params = {}): Promise<{ total: number, limit?: number, skip: number, data: M[] }> {
    const { filters, query, options } = this.$options(params)

    if (query._id) {
      query._id = this.$objectifyId(query._id)
    }

    const q = this.collection.find(query, options)

    if (filters.$select) {
      q.project(filters.$select.reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {}))
    }

    if (filters.$sort) {
      q.sort(filters.$sort)
    }

    if (filters.$limit) {
      q.limit(filters.$limit)
    }

    if (filters.$skip) {
      q.skip(filters.$skip)
    }

    const runQuery = async total => {
      return q.toArray().then((data) => {
        return {
          total,
          limit: filters.$limit,
          skip: filters.$skip ?? 0,
          data: data as M[]
        }
      })
    }

    const total = await this.collection.countDocuments(query, options)
    const result = runQuery(total)

    return result
  }

  protected async $createMany (data: any, params: Params): Promise<M[]> {
    const { options } = this.$options(params)
    const insertResult = await this.collection.insertMany(data, options)

    return Promise.all(Object.values(insertResult.insertedIds).map(async _id => this.collection.findOne({ _id }, options))) as Promise<M[]>
  }

  protected async $create (data: any, params: Params = {}): Promise<M | M[]> {
    const { options } = this.$options(params)

    if (Array.isArray(data)) {
      return this.$createMany(data, params)
    }

    const result = await this.collection.insertOne(data, options)

    return this.collection.findOne({ _id: result.insertedId }, options) as Promise<M>
  }

  protected async $update (id: NullableId, data: D, params = {}): Promise<M | M[]> {
    if (Array.isArray(data) || id === null) {
      return Promise.reject(
        new Error('Not replacing multiple records.')
      )
    }

    const { query, options } = this.$options(params)

    await this.collection.replaceOne({ ...query, _id: this.$objectifyId(id) }, omit(['_id'], data), options)
    return this.$get(id, params)
  }

  protected $remapModifiers (data: any) {
    let set = {}

    for (const key in data) {
      if (key.charAt(0) !== '$') {
        set[key] = data[key]
        delete data[key]
      }

      if (key === '$set') {
        set = Object.assign(set, data[key])
        delete data[key]
      }
    }

    if (Object.keys(set).length > 0) {
      data.$set = set
    }
    return data
  }

  protected async $patchMany (data, params = {}) {
    const { query, options } = this.$options(params)
    const remapModifier = this.$remapModifiers(omit(['_id'], data))

    await this.collection.updateMany(query, remapModifier, { ...options, multi: true })
    return this.$find(params).then(r => r.data)
  }

  protected async $patch (id: NullableId, data: D, params = {}) {
    if (Array.isArray(data) || id === null) {
      return this.$patchMany(data, params)
    }

    const { query, options } = this.$options(params)

    const remapModifier = this.$remapModifiers(omit(['_id'], data))

    await this.collection.updateOne({ ...query, _id: this.$objectifyId(id) }, remapModifier, options)
    return this.$get(id, params)
  }

  protected async $removeMany (params = {}) {
    const { query, options } = this.$options(params)

    const items = (await this.$find(params)).data
    await this.collection.deleteMany(query, { ...options, multi: true })

    return items
  }

  protected async $remove (id, params = {}) {
    if (id === null) {
      return this.$removeMany(params)
    }

    const { query, options } = this.$options(params)
    const item = await this.$get(id, query)

    await this.collection.deleteOne({ ...query, _id: this.$objectifyId(id) }, options)
    return item
  }

  async find (params?: Params): Promise<{ total: number, limit?: number, skip: number, data: M[] }> {
    return this.$find(params)
  }

  async get (id: Id, params?: Params): Promise<M> {
    return this.$get(id, params)
  }

  async create (data: D, params?: Params): Promise<M | M[]> {
    return this.$create(data, params)
  }

  async update (id: NullableId, data: D, params?: Params<Query> | undefined): Promise<M | M[]> {
    return this.$update(id, data, params)
  }

  async patch (id: NullableId, data: D, params?: Params<Query> | undefined): Promise<M | M[]> {
    return this.$patch(id, data, params)
  }

  async remove (id: NullableId, params?: Params<Query>): Promise<M | M[]> {
    return this.$remove(id, params)
  }
}

export default MongoDBService
