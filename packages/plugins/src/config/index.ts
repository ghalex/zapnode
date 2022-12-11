import { Application, Plugin } from 'zapnode'
import config from 'config'

export interface AppConfig<D> {
  config: D
}

export default (): Plugin => {
  function init (app: Application & { config: any }): void {
    app.config = config
  }

  return {
    name: 'config',
    init
  }
}
