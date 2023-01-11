import { Application, Id, NullableId, Params, Plugin, Service } from 'zapnode'
import { tap, forEach, mergeDeepRight } from 'ramda'

export default (): Plugin => {
  const addHooks = (app: Application, service: Service, hooks: any) => {
    const context: any = { app, service }

    const runWithHooks = async (methodName: string, method: any, ctx: any) => {
      const hooksBefore = [].concat(hooks.before.all).concat(hooks.before[methodName])
      const hooksAfter = [].concat(hooks.after.all).concat(hooks.after[methodName])

      forEach((fn: any) => tap(fn, ctx), hooksBefore)
      ctx.result = await method.call()
      forEach((fn: any) => tap(fn, ctx), hooksAfter)

      return ctx.result
    }

    if (service.find !== undefined) {
      const _find = service.find.bind(service)

      service.find = async (params?: Params) => {
        const method = async () => await _find(params)
        const ctx = { ...context, params }
        return await runWithHooks('find', method, ctx)
      }
    }

    if (service.get !== undefined) {
      const _get = service.get.bind(service)

      service.get = async (id: Id, params?: Params) => {
        const method = async () => await _get(id, params)
        const ctx = { ...context, params, id }
        return await runWithHooks('get', method, ctx)
      }
    }

    if (service.create !== undefined) {
      const _create = service.create.bind(service)

      service.create = async (data: any, params?: Params) => {
        const method = async () => await _create(data, params)
        const ctx = { ...context, params, data }
        return await runWithHooks('create', method, ctx)
      }
    }

    if (service.update !== undefined) {
      const _update = service.update.bind(service)

      service.update = async (id: NullableId, data: any, params?: Params) => {
        const method = async () => await _update(id, data, params)
        const ctx = { ...context, params, data }
        return await runWithHooks('update', method, ctx)
      }
    }

    if (service.patch !== undefined) {
      const _patch = service.patch.bind(service)

      service.patch = async (id: NullableId, data: any, params?: Params) => {
        const method = async () => await _patch(id, data, params)
        const ctx = { ...context, params, data }
        return await runWithHooks('patch', method, ctx)
      }
    }
  }

  function init (app: Application): void {
    app.events.newService.subscribe(({ key, service, options }) => {
      const defaultHooks = {
        before: { all: [], find: [], get: [], create: [], update: [], patch: [] },
        after: { all: [], find: [], get: [], create: [], update: [], patch: [] }
      }

      const hooks = mergeDeepRight(defaultHooks, options.hooks)

      addHooks(app, service, hooks)
    })
  }

  return {
    name: 'hooks',
    init
  }
}
