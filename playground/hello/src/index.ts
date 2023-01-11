import './alias'
import { zapnode } from 'zapnode'
import { config, express, hooks } from 'zapnode-plugins'

import registerServices from './services'
import mongodb from './plugins/mongodb'

import type { App } from './declarations'

const app: App = zapnode({
  plugins: [
    config(),
    hooks(),
    express(),
    mongodb()
  ]
})

registerServices(app)

app
  .listen(app.config.port)
  .then(() => {
    console.log('API ready at http://localhost:%s', app.config.port)
    console.log('API version: %s', app.config.version)
  })
  .catch(err => {
    console.error(err)
  })
