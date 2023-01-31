/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Id, NullableId, Paginated, Params } from 'zapnode'
import { omit, pick } from 'ramda'
import { Collection, ObjectId } from 'mongodb'

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

class MongoDBRepository<Result = any, Data = Partial<Result>, RepositoryParams extends Params<any> = any> {
  protected collection: Collection
  protected keys = ['$sort', '$limit', '$skip', '$select']

  protected $objectifyId (id: any) {
    if (ObjectId.isValid(id)) {
      id = new ObjectId(id.toString())
    }

    return id
  }

  constructor (collection: Collection) {
    if (collection === undefined) {
      throw new Error('MongoDB collection have to be provided')
    }

    this.collection = collection
  }

  protected $options (params: any = {}): Options {
    const omitKeys = Object.keys(params.query ?? {}).filter(key => key.indexOf('$') === 0)
    const filters = pick(this.keys, params.query ?? {})
    const query = omit(omitKeys, params.query ?? {})
    const options = Object.assign({ paginate: params.query?.$paginate !== undefined }, params.options)

    return { filters, query, options }
  }

  protected $remapModifiers (data: any) {
    let set = {} as any

    for (const key in data) {
      if (key.charAt(0) !== '$') {
        set[key] = data[key]
        delete data[key]
      }

      if (key === '$set') {
        set = Object.assign(set, data[key]) as Data
        delete data[key]
      }
    }

    if (Object.keys(set).length > 0) {
      data.$set = set
    }
    return data
  }

  async get (id: Id, params?: RepositoryParams): Promise<Result> {
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
      return pick(['_id', ...fields], data) as Result
    }

    return data as Result
  }

  async find (params?: RepositoryParams): Promise<Result[]>
  async find (params?: RepositoryParams & { query: { $paginate: true } }): Promise<Paginated<Result>>
  async find (params: RepositoryParams = {} as RepositoryParams): Promise<Paginated<Result> | Result[]> {
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
          data: data as Result[]
        }
      })
    }

    if (options.paginate) {
      const total = await this.collection.countDocuments(query, options)
      const result = await runQuery(total)

      return result
    }

    const result = await q.toArray() as Result[]
    return result
  }

  protected async $createMany (data: Data[], params: RepositoryParams = {} as RepositoryParams): Promise<Result[]> {
    const { options } = this.$options(params)
    const insertResult = await this.collection.insertMany(data as any, options)

    return Promise.all(Object.values(insertResult.insertedIds).map(async _id => this.collection.findOne({ _id }, options))) as Promise<Result[]>
  }

  // async create (data: Data, params?: RepositoryParams): Promise<Result>
  // async create (data: Data[], params?: RepositoryParams): Promise<Result[]>
  async create (data: Data | Data[], params: RepositoryParams = {} as RepositoryParams): Promise<Result | Result[]> {
    const { options } = this.$options(params)

    if (Array.isArray(data)) {
      return this.$createMany(data, params)
    }

    const result = await this.collection.insertOne(data as any, options)

    return this.collection.findOne({ _id: result.insertedId }, options) as Promise<Result>
  }

  public async update (id: Id, data: Data, params?: RepositoryParams): Promise<Result> {
    if (Array.isArray(data) || id === null) {
      return Promise.reject(
        new Error('Not replacing multiple records.')
      )
    }

    const { query, options } = this.$options(params)

    await this.collection.replaceOne({ ...query, _id: this.$objectifyId(id) }, omit(['_id'], data), options)
    return this.get(id, params)
  }

  protected async $patchMany (data: Data, params: RepositoryParams) {
    const { query, options } = this.$options(params)
    const remapModifier = this.$remapModifiers(omit(['_id'], data))

    await this.collection.updateMany(query, remapModifier, { ...options, multi: true })
    return this.find({ ...params, paginate: false })
  }

  public async patch (id: NullableId, data: Data, params?: RepositoryParams) {
    if (id === null) {
      if (params === undefined) {
        throw new Error('Cannot patch multiple objects without params')
      }

      return this.$patchMany(data, params)
    }

    const { query, options } = this.$options(params)

    const remapModifier = this.$remapModifiers(omit(['_id'], data))

    await this.collection.updateOne({ ...query, _id: this.$objectifyId(id) }, remapModifier, options)
    return this.get(id, params)
  }

  protected async $removeMany (params: RepositoryParams) {
    const { query, options } = this.$options(params)

    const items = (await this.find({ ...params, paginate: false }))
    await this.collection.deleteMany(query, { ...options, multi: true })

    return items
  }

  public async remove (id: NullableId, params?: RepositoryParams) {
    if (id === null) {
      if (params === undefined) {
        throw new Error('Cannot remove multiple objects without params')
      }

      return this.$removeMany(params)
    }

    const { query, options } = this.$options(params)
    const item = await this.get(id, query)

    await this.collection.deleteOne({ ...query, _id: this.$objectifyId(id) }, options)
    return item
  }
}

export default MongoDBRepository
