import { Express, Request, Response } from 'express'
import { Id, Params, Service, NotImplemented } from 'zapnode'
import errorHandler from './errorHandler'

const getParams = (req: Request): Params => {
  return {
    headers: req.headers,
    query: req.query
  }
}

const findHandler = (service: Service) => (req: Request, res: Response, next): void => {
  const params: Params = getParams(req)

  if (service.find !== undefined) {
    service
      .find(params)
      .then(data => res.status(200).json(data))
      .catch(err => {
        return errorHandler(err, req, res)
      })
  } else {
    return errorHandler(new NotImplemented(), req, res)
  }
}

const getHandler = (service: Service) => (req: Request, res: Response, next): void => {
  const id: Id = req.params.id
  const params: Params = getParams(req)

  if (service.get !== undefined) {
    service
      .get(id, params)
      .then(data => res.status(200).json(data))
      .catch(err => errorHandler(err, req, res))
  } else {
    return errorHandler(new NotImplemented(), req, res)
  }
}

const createHandler = (service: Service) => (req: Request, res: Response, next): void => {
  const params: Params = getParams(req)
  const body = req.body

  if (service.create !== undefined) {
    service
      .create(body, params)
      .then(data => res.status(200).json(data))
      .catch(err => errorHandler(err, req, res))
  } else {
    return errorHandler(new NotImplemented(), req, res)
  }
}

const updateHandler = (service: Service) => (req: Request, res: Response, next): void => {
  const id: Id = req.params.id
  const params: Params = getParams(req)
  const body = req.body

  if (service.update !== undefined) {
    service
      .update(id, body, params)
      .then(data => res.status(200).json(data))
      .catch(err => errorHandler(err, req, res))
  } else {
    return errorHandler(new NotImplemented(), req, res)
  }
}

const patchHandler = (service: Service) => (req: Request, res: Response, next): void => {
  const id: Id = req.params.id
  const params: Params = getParams(req)
  const body = req.body

  if (service.patch !== undefined) {
    service
      .patch(id, body, params)
      .then(data => res.status(200).json(data))
      .catch(err => errorHandler(err, req, res))
  } else {
    return errorHandler(new NotImplemented(), req, res)
  }
}

const customHandler = (method: string, service: Service) => (req: Request, res: Response, next): void => {
  const params: Params = getParams(req)
  const body = req.body

  console.log(method, service, service[method])

  if (service[method] !== undefined) {
    service[method](body, params)
      .then(data => res.status(200).json(data))
      .catch(err => errorHandler(err, req, res))
  } else {
    return errorHandler(new NotImplemented(), req, res)
  }
}

const mount = (app: Express, path: string, service: Service, options: any): void => {
  const { customMethods } = options

  if (customMethods !== undefined) {
    const methods = Object.keys(customMethods)

    for (const method of methods) {
      app.post(`${path}/${customMethods[method].path as string ?? method}`, customHandler(method, service))
    }
  }

  app.get(path, findHandler(service))
  app.get(path + '/:id', getHandler(service))
  app.post(path, createHandler(service))
  app.post(path + '/:id', updateHandler(service))
  app.patch(path + '/:id', patchHandler(service))
}

export default mount
