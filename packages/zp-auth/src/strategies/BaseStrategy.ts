import { StrategyResult, AuthenticationRequest } from '../declarations'
import { Application } from 'zapnode'
import { AppConfig } from 'zapnode-plugins'

abstract class BaseStrategy {
  protected app?: Application & AppConfig
  protected name?: string

  setName (value: string) {
    this.name = value
  }

  getName () {
    return this.name
  }

  setApp (value: Application & AppConfig) {
    this.app = value
  }

  get configuration (): any {
    let config = {}

    try {
      config = this.app?.config.get('auth') || {}
    } catch {}

    return config
  }

  abstract authenticate (data: AuthenticationRequest): Promise<StrategyResult>
}

export default BaseStrategy
