import { Application, Id, NullableId, Params, Plugin, Service } from 'zapnode'
import { tap, forEach, propOr } from 'ramda'

export default (): Plugin => {
  const addHooks = (app: Application, service: Service, hooks: any) => {
    const context: any = { app, service }

    const runWithHooks = async (methodName: string, method: any, ctx: any) => {
      const hooksBefore = propOr<any, any, any>([], methodName, hooks.before)
      const hooksAfter = propOr<any, any, any>([], methodName, hooks.after)

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
  }

  function init (app: Application): void {
    app.events.newService.subscribe(({ key, service, options }) => {
      addHooks(app, service, options.hooks)
    })
  }

  return {
    name: 'hooks',
    init
  }
}
