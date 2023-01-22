// import { GeneralError } from 'zapnode'
import { App } from '../declarations'

import { registerHello } from './hello/hello'
import { registerStatus } from './status/status'
import { registerUsers } from './users/users'

const registerServices = async (app: App) => {
  await registerHello(app)
  await registerStatus(app)
  await registerUsers(app)
}

export default registerServices
