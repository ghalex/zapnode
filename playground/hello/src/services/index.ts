// import { GeneralError } from 'zapnode'
import { App } from '../declarations'

import { registerHello } from './hello/hello'
import { registerStatus } from './status/status'
import { registerUsers } from './users/users'
import { registerAuth } from './auth/auth'

const registerServices = async (app: App) => {
  await registerHello(app)
  await registerUsers(app)
  await registerAuth(app)
  await registerStatus(app)
}

export default registerServices
