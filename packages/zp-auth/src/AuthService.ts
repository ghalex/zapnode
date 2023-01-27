import jwt from 'jsonwebtoken'
import { Application, NotAuthenticated } from 'zapnode'
import { AppConfig } from 'zapnode-plugins'
import BaseStrategy from './strategies/BaseStrategy'
import LocalStrategy from './strategies/LocalStrategy'
import { AuthenticationRequest } from './declarations'
import { mergeDeepRight } from 'ramda'

class AuthService {
  protected strategies: BaseStrategy[] = []

  constructor (private readonly app: Application & AppConfig) {}

  get configuration () {
    const config: any = this.app.config.auth || {}
    const configJWT = {
      secret: '1234secret',
      options: {
        header: { typ: 'access' },
        issuer: 'zapnode',
        algorithm: 'HS256',
        expiresIn: '1d'
      }
    }

    return mergeDeepRight({ entity: 'user', jwt: configJWT }, config)
  }

  addStrategy (name: string, strategy: BaseStrategy) {
    if (typeof strategy.setName === 'function') {
      strategy.setName(name)
    }

    if (typeof strategy.setApp === 'function') {
      strategy.setApp(this.app)
    }

    this.strategies.push(strategy)
  }

  async createAccessToken (payload: any) {
    const { jwt: { secret, options } } = this.configuration
    return jwt.sign(payload, secret, options)
  }

  async verifyAccessToken (accessToken: string) {
    const { jwt: { secret, options } } = this.configuration
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

  async hashPassword (value: string, strategyName: string) {
    const strategy = this.strategies.find(s => s.getName() === strategyName) as LocalStrategy
    if (strategy) {
      return await strategy.hashPassword(value)
    }

    return value
  }

  async login (data: AuthenticationRequest) {
    const { entity } = this.configuration
    const strategy = this.strategies.find(s => s.getName() === data.strategy)

    if (strategy) {
      const authentication = await strategy.authenticate(data)
      const accessToken = await this.createAccessToken(authentication[entity])
      const payload = jwt.decode(accessToken)

      return { accessToken, authentication: { strategy: data.strategy, payload }, [entity]: authentication[entity] }
    }

    throw new NotAuthenticated('Invalid authentication information (strategy not found)')
  }
}

export default AuthService
