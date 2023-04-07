import express, { Express } from 'express'
import { Application, Plugin } from 'zapnode'
import { queryParser } from 'express-query-parser'

import cors from './cors'
import mount from './mount'

export interface AppExpress {
  listen: (port: number) => Promise<void>
  express: Express
}

export default (app?: Express): Plugin => {
  const name = 'express'
  const expressApp = app ?? (() => {
    const newApp = express()
    newApp.use(express.urlencoded({ extended: true }))
    newApp.use(express.json({ limit: '1000kb' }))
    newApp.use(queryParser({
      parseNull: true,
      parseUndefined: true,
      parseBoolean: true,
      parseNumber: true
    }))

    return newApp
  })()

  expressApp.use('/', cors('*'))

  const listen = async (port: number): Promise<void> => {
    return await new Promise((resolve, reject) => {
      expressApp.listen(port, () => {
        resolve()
      })
    })
  }

  function init (app: Application & AppExpress): void {
    app.requirePlugin('config', name)
    app.listen = listen
    app.express = expressApp

    app.events.newService.subscribe(({ key, service, options }) => {
      const path = `/${key}`
      const { customPath } = options
      mount(expressApp, customPath ?? path, service, options)
    })
  }

  return {
    name,
    init
  }
}
