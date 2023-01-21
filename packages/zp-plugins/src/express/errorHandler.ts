import { Request, Response } from 'express'
import { GeneralError } from 'zapnode'

const errorHandler = (err: any, req: Request, res: Response) => {
  const error = err.toJSON !== undefined ? err : new GeneralError(err.message)
  const output = Object.assign({}, error.toJSON())

  if (err.stack !== undefined) {
    output.stack = err.stack
  }

  res.status(error.code)
  res.json(output)
}

export default errorHandler
