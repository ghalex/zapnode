import { Application, Id, NullableId, Params, Plugin, Service } from 'zapnode'
import { mergeDeepRight } from 'ramda'

export interface HookContext<A = Application> {
  readonly app: A
  readonly service: Service
  readonly method: string
  readonly type: 'before' | 'after'
  params: Params
  id?: Id
  data?: any
  result?: any
}

export default (): Plugin => {
  const addHooks = (app: Application, service: Service, hooks: any, customMethods: any) => {
    const context: any = { app, service }

    const runWithHooks = async (methodName: string, method: any, ctx: any) => {
      const hooksBefore: any[] = [].concat(hooks.before.all).concat(hooks.before[methodName])
      const hooksAfter: any[] = [].concat(hooks.after.all).concat(hooks.after[methodName])

      // before hook
      ctx.type = 'before'
      await hooksBefore.reduce((p, fn) => p.then(() => fn(ctx)), Promise.resolve())

      // execute
      ctx.result = await method.call()

      // after hook
      ctx.type = 'after'
      await hooksAfter.reduce((p, fn) => p.then(() => fn(ctx)), Promise.resolve())

      return ctx.result
    }

    if (service.find !== undefined) {
      const _find = service.find.bind(service)

      service.find = async (params?: Params) => {
        const ctx = { ...context, params, method: 'find' }
        const method = async () => await _find(ctx.params)
        return await runWithHooks('find', method, ctx)
      }
    }

    if (service.get !== undefined) {
      const _get = service.get.bind(service)

      service.get = async (id: Id, params?: Params) => {
        const ctx = { ...context, params, id, method: 'get' }
        const method = async () => await _get(ctx.id, ctx.params)
        return await runWithHooks('get', method, ctx)
      }
    }

    if (service.create !== undefined) {
      const _create = service.create.bind(service)

      service.create = async (data: any, params?: Params) => {
        const ctx = { ...context, data, params, method: 'create' }
        const method = async () => await _create(ctx.data, ctx.params)
        return await runWithHooks('create', method, ctx)
      }
    }

    if (service.update !== undefined) {
      const _update = service.update.bind(service)

      service.update = async (id: NullableId, data: any, params?: Params) => {
        const ctx = { ...context, id, params, data, method: 'update' }
        const method = async () => await _update(ctx.id, ctx.data, ctx.params)
        return await runWithHooks('update', method, ctx)
      }
    }

    if (service.patch !== undefined) {
      const _patch = service.patch.bind(service)

      service.patch = async (id: NullableId, data: any, params?: Params) => {
        const ctx = { ...context, id, params, data, method: 'patch' }
        const method = async () => await _patch(ctx.id, ctx.data, ctx.params)
        return await runWithHooks('patch', method, ctx)
      }
    }

    if (service.remove !== undefined) {
      const _remove = service.remove.bind(service)

      service.remove = async (id: NullableId, params?: Params) => {
        const ctx = { ...context, params, id, method: 'remove' }
        const method = async () => await _remove(ctx.id, ctx.params)
        return await runWithHooks('remove', method, ctx)
      }
    }

    if (customMethods !== undefined) {
      const methods = Object.keys(customMethods)

      for (const methodName of methods) {
        if (service[methodName] !== undefined) {
          const _methodCustom = service[methodName].bind(service)

          service[methodName] = async (data: any, params?: Params) => {
            const ctx = { ...context, params, data, method: methodName }
            const method = async () => await _methodCustom(ctx.data, ctx.params)
            return await runWithHooks(methodName, method, ctx)
          }
        }
      }
    }
  }

  function init (app: Application): void {
    app.events.newService.subscribe(({ key, service, options }) => {
      const methods = ['all', 'find', 'get', 'create', 'update', 'patch', 'remove'].concat(options.customMethods !== undefined ? Object.keys(options.customMethods) : [])
      const defaultHooks = { before: {}, after: {} }

      for (const method of methods) {
        defaultHooks.before[method] = []
        defaultHooks.after[method] = []
      }

      const hooks = mergeDeepRight(defaultHooks, options.hooks || {})

      addHooks(app, service, hooks, options.customMethods)
    })
  }

  return {
    name: 'hooks',
    init
  }
}

export { default as resultHook } from './all/resultHook'
export { default as queryHook } from './all/queryHook'
export { default as dataHook } from './all/dataHook'
