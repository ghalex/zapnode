import { NotAuthenticated } from 'zapnode'
import { HookContext } from 'zapnode-plugins'
import { AuthService } from '..'

const getToken = (headers: any) => {
  const authorization = headers?.authorization

  if (!authorization || authorization.indexOf('Bearer ') !== 0) {
    throw new NotAuthenticated('Invalid token')
  }

  const values = authorization.split(' ')
  return values[1]
}

const authenticate = (serviceName: string = 'auth') => {
  return async (ctx: HookContext) => {
    const { app, type } = ctx

    if (type && type !== 'before') {
      throw new NotAuthenticated('The authenticate hook must be used as a before hook')
    }

    const authService: AuthService = app.services[serviceName]

    if (!authService) {
      throw new NotAuthenticated('Could not find a valid authentication service')
    }

    if (ctx.params.authenticated === true) {
      return Promise.resolve()
    }

    const token = getToken(ctx.params.headers)

    try {
      const res = await authService.verifyAccessToken(token)

      ctx.params.authenticated = true
      ctx.params.user = res
    } catch (err: any) {
      throw new NotAuthenticated('Invalid token')
    }
  }
}

export default authenticate
