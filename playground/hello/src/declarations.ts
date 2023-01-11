import { Application } from 'zapnode'
import { AppExpress, AppConfig } from 'zapnode-plugins'
import type { MyServices } from './services'

export interface ConfigData {
  host: string
  port: number
  version: string
  mongodb: {
    user: string
    password: string
    host: string
    db: string
    protocol: string
  }
}

export type AppWithConfig = AppConfig<ConfigData>

export type AppExtend = Application<MyServices> & AppExpress & AppWithConfig
export interface App extends AppExtend {}
