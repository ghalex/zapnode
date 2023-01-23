import { Resolver } from 'zapnode'
import { HookContext } from '..'

const dataHook = <T, C extends HookContext>(resolver: Resolver<T, C>) => {
  return async (ctx: C) => {
    const data = ctx.data

    if (Array.isArray(data)) {
      ctx.data = await Promise.all(ctx.result.map(async (item) => await resolver.resolve(item, ctx)))
    } else {
      ctx.data = await resolver.resolve(data, ctx)
    }
  }
}

export default dataHook
