import { Resolver } from 'zapnode'
import { HookContext } from '..'

const dataHook = <T, C extends HookContext>(resolver: Resolver<T, C>) => {
  return async (ctx: C) => {
    if (ctx.data) {
      const data = ctx.data

      if (Array.isArray(data)) {
        ctx.data = await Promise.all(data.map(async (item) => await resolver.resolve(item, ctx)))
      } else {
        ctx.data = await resolver.resolve(data, ctx)
      }
    }
  }
}

export default dataHook
