export class ZapnodeError extends Error {
  readonly name: string
  readonly code: number
  readonly data: any

  constructor (name: string, code: number, message?: string, data?: any) {
    super(message ?? 'Error')
    this.name = name
    this.code = code
    this.data = data
  }

  toJSON () {
    const result = {
      name: this.name,
      message: this.message,
      code: this.code,
      data: undefined
    }

    if (this.data !== undefined) {
      result.data = this.data
    }

    return result
  }
}

export class BadRequest extends ZapnodeError {
  constructor (message?: string, data?: any) {
    super('BadRequest', 400, message, data)
  }
}

// 401 - Not Authenticated
export class NotAuthenticated extends ZapnodeError {
  constructor (message?: string, data?: any) {
    super('NotAuthenticated', 401, message, data)
  }
}

export class GeneralError extends ZapnodeError {
  constructor (message?: string, data?: any) {
    super('GeneralError', 500, message, data)
  }
}

export class NotImplemented extends ZapnodeError {
  constructor (message?: string, data?: any) {
    super('NotImplemented', 501, message, data)
  }
}
