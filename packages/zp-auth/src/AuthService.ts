import jwt from 'jsonwebtoken'
import { Application, NotAuthenticated, Params, Query, Service } from 'zapnode'
import { AppConfig } from 'zapnode-plugins'
import BaseStrategy from './strategies/BaseStrategy'
import LocalStrategy from './strategies/LocalStrategy'
import { AuthenticationRequest, AuthenticationResult } from './declarations'
import { mergeDeepRight } from 'ramda'

type AuthServiceParams = Params<Query>
interface AuthConfiguration {
  entity: string
  jwt: {
    secret: string
    options: any
  }
}

class AuthService implements Service<AuthenticationResult, AuthenticationRequest, AuthServiceParams> {
  protected strategies: BaseStrategy[] = []

  constructor (private readonly app: Application & AppConfig) {}

  get configuration (): AuthConfiguration {
    const config = this.app.config.get('auth')
    const configJwtDefault = {
      secret: '1234secret',
      options: {
        header: { typ: 'access' },
        issuer: 'zapnode',
        algorithm: 'HS256',
        expiresIn: '1d'
      }
    }

    const configJwt = mergeDeepRight(configJwtDefault, config?.jwt ?? {})

    return {
      entity: config?.entity ?? 'user',
      jwt: configJwt
    }
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
    const strategy = this.strategies.find(s => s.getName() === strategyName)
    if (strategy) {
      return await (strategy as LocalStrategy).hashPassword(value)
    }

    return value
  }

  async create (data: AuthenticationRequest, params?: AuthServiceParams): Promise<AuthenticationResult>
  async create (data: AuthenticationRequest[], params?: AuthServiceParams): Promise<AuthenticationResult[]>
  async create (data: AuthenticationRequest | AuthenticationRequest[], params?: AuthServiceParams): Promise<AuthenticationResult | AuthenticationResult[]> {
    if (Array.isArray(data)) {
      throw new NotAuthenticated('Invalid data information')
    }

    console.log(this.configuration)

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
