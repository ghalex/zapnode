import { Resolver } from 'zapnode'
import { HookContext } from '..'

const queryHook = <T, C extends HookContext>(resolver: Resolver<T, C>) => {
  return async (ctx: C) => {
    if (ctx.params?.query) {
      ctx.params.query = resolver.resolve(ctx.params.query as any, ctx)
    }
  }
}

export default queryHook
