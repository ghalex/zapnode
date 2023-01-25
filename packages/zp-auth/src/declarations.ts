
export interface AuthenticationRequest {
  strategy?: string
  [key: string]: any
}

export interface AuthenticationResult {
  strategy: string
  [key: string]: any
}
