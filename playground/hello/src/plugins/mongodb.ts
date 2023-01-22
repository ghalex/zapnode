import { Plugin } from 'zapnode'
import { MongoClient, Db } from 'mongodb'
import { App } from '../declarations'

declare module '@/declarations' {
  interface App {
    db: Promise<Db>
  }
}

export default (): Plugin => {
  function init (app: App): void {
    const { user, password, host, db, protocol } = app.config.mongodb
    const uri = `${protocol}://${user}:${password}@${host}`

    const mongoClient = MongoClient.connect(uri).then((client) => client.db(db))
    app.db = mongoClient
  }

  return {
    name: 'mongodb',
    init
  }
}
