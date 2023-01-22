import { Application, Service } from 'zapnode'
import { AppExpress, AppConfig } from 'zapnode-plugins'

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

interface Services {
  [key: string]: Service
}
export interface MyServices extends Services {}

export type AppWithConfig = AppConfig<ConfigData>
export type AppExtend = Application<MyServices> & AppExpress & AppWithConfig
export interface App extends AppExtend {

}
