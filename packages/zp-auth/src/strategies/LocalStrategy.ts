
import { omit, pick } from 'ramda'
import passwordHash from 'password-hash'

import BaseStrategy from './BaseStrategy'
import { NotAuthenticated } from 'zapnode'
import { AuthenticationRequest } from '@/declarations'

export class LocalStrategy extends BaseStrategy {
  get configuration () {
    const config = { ...super.configuration }

    return {
      saltLength: 5,
      service: 'users',
      entity: 'user',
      entityFields: [],
      errorMessage: 'Invalid login',
      usernameField: 'email',
      passwordField: 'password',
      ...config
    }
  }

  async hashPassword (password: string) {
    return passwordHash.generate(password, { saltLength: this.configuration.saltLength })
  }

  async comparePassword (entity: any, password: string) {
    const { passwordField, errorMessage } = this.configuration
    const hash = entity[passwordField]

    if (!hash) {
      throw new NotAuthenticated(errorMessage)
    }

    const result = passwordHash.verify(password, hash)

    if (!result) {
      throw new NotAuthenticated(errorMessage)
    }

    return entity
  }

  async authenticate (data: AuthenticationRequest) {
    const { usernameField, passwordField, service: serviceName, errorMessage, entity: entityName, entityFields } = this.configuration
    const username = data[usernameField]
    const password = data[passwordField]
    const service = this.app?.services[serviceName]
    const query = { [usernameField]: username, $limit: 1 }

    if (!service) {
      throw new NotAuthenticated('Could not get service')
    }

    const result = await service.$find({ query })
    const list = Array.isArray(result) ? result : result.data

    if (!Array.isArray(list) || list.length === 0) {
      throw new NotAuthenticated(errorMessage)
    }

    const [entity] = list

    await this.comparePassword(entity, password)

    return {
      strategy: this.name ?? 'local',
      [entityName]: entityFields.length > 0 ? pick(entityFields, omit([passwordField], entity)) : omit([passwordField], entity)
    }
  }
}

export default LocalStrategy
