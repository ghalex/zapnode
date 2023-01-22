import { Application, Plugin } from 'zapnode'
import config from 'config'

export interface AppConfig<D = any> {
  config: D
}

export default (): Plugin => {
  function init (app: Application & AppConfig): void {
    app.config = config
  }

  return {
    name: 'config',
    init
  }
}
