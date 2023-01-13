import express, { Express } from 'express'
import { Application, Plugin } from 'zapnode'

import cors from './cors'
import mount from './mount'

export interface AppExpress {
  listen: (port: number) => Promise<void>
  express: Express
}

export default (app?: Express): Plugin => {
  const name = 'express'
  const expressApp = app ?? express()

  expressApp.use(express.urlencoded({ extended: true }))
  expressApp.use(express.json())
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
      mount(expressApp, `/${key as string}`, service, options)
    })
  }

  return {
    name,
    init
  }
}
