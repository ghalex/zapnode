import { Plugin, Service } from './declaration'
import { ReplaySubject } from 'rxjs'

export class Application<S extends { [key: string]: Service } = any> {
  #plugins: Map<string, Plugin>
  #services: Map<string, Service>

  events = {
    newPlugin: new ReplaySubject<{ plugin: Plugin }>(),
    newService: new ReplaySubject<{ key: string, service: Service }>()
  }

  constructor () {
    this.#plugins = new Map()
    this.#services = new Map()
  }

  public get services (): S {
    return Object.fromEntries(this.#services) as S
  }

  public addPlugin (plugin: Plugin): void {
    this.#plugins.set(plugin.name, plugin)

    plugin.init(this)
    this.events.newPlugin.next({ plugin })
  }

  public hasPlugin (name: string): boolean {
    return this.#plugins.has(name)
  }

  public requirePlugin (name: string, by: string): void {
    if (!this.hasPlugin(name)) {
      throw new Error(`Plugin ${name} is required by ${by}`)
    }
  }

  public addService (key: string, service: Service): void {
    if (this.#services.has(key)) {
      throw new Error(`Service ${key} allready registered.`)
    }

    this.#services.set(key, service)
    this.events.newService.next({ key, service })
  }
}

interface Options<A> {
  plugins: Plugin[]
  services: (app: A) => {
    [key: string]: Service
  }
}

export const zapnode = <A extends Application>(options: Options<A>): A => {
  const app: Application = new Application()

  for (const plugin of options.plugins) {
    app.addPlugin(plugin)
  }

  const services = options.services(app as any)

  for (const key in services) {
    app.addService(key, services[key])
  }

  return app as any
}
