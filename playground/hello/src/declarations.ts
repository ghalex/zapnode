import { Application } from 'zapnode'
import { AppExpress, AppConfig } from 'zapnode-plugins'
import type { MyServices } from './services'

export interface ConfigData {
  host: string
  port: number
  version: string
}

export type AppWithConfig = AppConfig<ConfigData>

export type App = Application<MyServices> & AppExpress & AppWithConfig
