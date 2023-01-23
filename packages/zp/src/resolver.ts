/* eslint-disable @typescript-eslint/no-non-null-assertion */

export type PropertyResolver<T, V, C> = ((
  value: V | undefined,
  obj: T,
  context: C,
) => Promise<V | undefined>)

export type Properties<T, C> = {
  [key in keyof T]?: PropertyResolver<T, T[key], C>
}

export class Resolver<T, C> {
  public propertyNames: Array<(keyof T)>

  constructor (protected readonly properties: Properties<T, C>) {
    this.propertyNames = Object.keys(properties) as any as Array<(keyof T)>
  }

  async resolveProperty<D, K extends keyof T>(name: K, data: D, context: C): Promise<T[K] | undefined> {
    const resolver = this.properties[name]
    const value = (data as any)[name]

    if (resolver) {
      return resolver(value, data as any, context)
    }

    return Promise.resolve(value)
  }

  async resolve (data: Partial<T>, context: C): Promise<T> {
    if (this.propertyNames.length === 0) {
      return data as T
    }

    const propertyList = [...new Set(Object.keys(data).concat(this.propertyNames as string[]))] as Array<keyof T>

    const result: any = {}
    const errors: any = {}
    let hasErrors = false

    // Not the most elegant but better performance
    await Promise.all(
      propertyList.map(async (name) => {
        const value = data[name]

        if (this.properties[name]) {
          try {
            const resolved = await this.resolveProperty(name, data, context)

            if (resolved !== undefined) {
              result[name] = resolved
            }
          } catch (error: any) {
            errors[name] = { message: error.message || error }
            hasErrors = true
          }
        } else if (value !== undefined) {
          result[name] = value
        }
      })
    )

    if (hasErrors) {
      throw new Error('Error resolving data', errors)
    }

    return result
  }
}

export function resolve<T, C> (properties: Properties<T, C>) {
  return new Resolver<T, C>(properties)
}
