import './alias'
import { zapnode } from 'zapnode'
import { config, express } from 'zapnode-plugins'
import services from './services'

import type { App } from './declarations'

const app: App = zapnode({
  plugins: [config(), express()],
  services
})

app
  .listen(app.config.port)
  .then(() => {
    console.log(app.config)
    console.log('API ready at http://localhost:%s', app.config.port)
    console.log('API version: %s', app.config.version)
  })
  .catch(err => {
    console.error(err)
  })
