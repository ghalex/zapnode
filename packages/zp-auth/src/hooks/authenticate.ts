import { NotAuthenticated } from 'zapnode'
import { AppConfig, HookContext } from 'zapnode-plugins'
import jwt from 'jsonwebtoken'

const getToken = (headers: any) => {
  const authorization = headers?.authorization

  if (!authorization || authorization.indexOf('Bearer ') !== 0) {
    throw new NotAuthenticated('Invalid token')
  }

  const values = authorization.split(' ')
  return values[1]
}

const verifyAccessToken = async (accessToken: string, secret: string, options: any) => {
  const { algorithm } = options

  // Normalize the `algorithm` setting into the algorithms array
  if (algorithm) {
    options.algorithms = (Array.isArray(algorithm) ? algorithm : [algorithm]) as Algorithm[]
    delete options.algorithm
  }

  try {
    const verified = jwt.verify(accessToken, secret, options)

    return verified as any
  } catch (error: any) {
    throw new NotAuthenticated(error.message, error)
  }
}

const authenticate = () => {
  return async (ctx: HookContext<AppConfig>) => {
    const { app, type } = ctx
    const { jwt: { secret, options } } = app.config.get('auth')

    if (type && type !== 'before') {
      throw new NotAuthenticated('The authenticate hook must be used as a before hook')
    }

    if (ctx.params.authenticated === true) {
      return Promise.resolve()
    }

    const token = getToken(ctx.params.headers)

    try {
      const res = await verifyAccessToken(token, secret, options)

      ctx.params.authenticated = true
      ctx.params.user = res
    } catch (err: any) {
      throw new NotAuthenticated('Invalid token')
    }
  }
}

export default authenticate
