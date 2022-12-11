import { App } from '../declarations'
import Hello from './hello'
import Status from './status'

const factory = (app: App) => {
  return {
    hello: new Hello(),
    status: new Status(app.config)
  }
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type MyServices = {
  hello: Hello
  status: Status
}

export default factory
