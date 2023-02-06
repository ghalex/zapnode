import { Resolver } from 'zapnode'
import { HookContext } from '..'

const getData = <H extends HookContext>(context: H) => {
  const isPaginated = context.method === 'find' && context.params.query?.$paginate !== undefined
  const data = isPaginated ? context.result.data : context.result

  return { isPaginated, data }
}

const resultHook = <T, C extends HookContext>(resolver: Resolver<T, C>) => {
  return async (ctx: C) => {
    if (ctx.result) {
      const { data, isPaginated } = getData(ctx)

      const result = Array.isArray(data)
        ? await Promise.all(data.map(async (item) => await resolver.resolve(item, ctx)))
        : await resolver.resolve(data, ctx)

      ctx.result = isPaginated
        ? { ...ctx.result, data: result }
        : result
    }
  }
}

export default resultHook
