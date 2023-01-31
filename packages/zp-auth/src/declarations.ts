
export interface StrategyResult {
  strategy: string
  [key: string]: any
}

export interface AuthenticationRequest {
  strategy: string
  [key: string]: any
}

export interface AuthenticationResult {
  accessToken: string
  authentication: StrategyResult
  [key: string]: any
}
