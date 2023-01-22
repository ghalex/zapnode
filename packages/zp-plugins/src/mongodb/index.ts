import { Application, Plugin } from 'zapnode'
import { MongoClient, Db } from 'mongodb'
import { AppConfig } from '..'

export interface AppMongo {
  db: Promise<Db>
}

export interface ConfigMongo {
  mongodb: {
    user: string
    password: string
    host: string
    db: string
    protocol: string
  }
}

export default (): Plugin => {
  const name = 'express'

  function init (app: Application & AppConfig<ConfigMongo> & AppMongo): void {
    app.requirePlugin('config', name)

    const { user, password, host, db, protocol } = app.config.mongodb
    const uri = `${protocol}://${user}:${password}@${host}`

    const mongoClient = MongoClient.connect(uri).then((client) => client.db(db))
    app.db = mongoClient
  }

  return {
    name,
    init
  }
}
