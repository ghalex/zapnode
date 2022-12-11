import express, { Request, Response } from 'express'
import { Application, Id, Params, Plugin, Service } from 'zapnode'
import cors from './cors'

export interface AppExpress {
  listen: (port: number) => Promise<void>
}

export default (): Plugin => {
  const name = 'express'
  const expressApp = express()

  expressApp.use(express.urlencoded({ extended: true }))
  expressApp.use(express.json())
  expressApp.use('/', cors('*'))

  // expressApp.use((req, res) => {
  //   res.json({ ok: 1 })
  // })

  const listen = async (port: number): Promise<void> => {
    return await new Promise((resolve, reject) => {
      expressApp.listen(port, () => {
        resolve()
      })
    })
  }

  const getParams = (req: Request): Params => {
    return {
      headers: req.headers,
      query: req.query
    }
  }

  const mountService = (path: string, service: Service): void => {
    const findHandler = (req: Request, res: Response, next): void => {
      const params: Params = getParams(req)

      if (service.find !== undefined) {
        service
          .find(params)
          .then(data => res.status(200).json(data))
          .catch(err => next(err))
      } else {
        res.status(200).send('Not implementd')
      }
    }

    const getHandler = (req: Request, res: Response, next): void => {
      const id: Id = req.params.id
      const params: Params = getParams(req)

      if (service.get !== undefined) {
        service
          .get(id, params)
          .then(data => res.status(200).json(data))
          .catch(err => next(err))
      } else {
        res.status(200).send('Not implementd')
      }
    }

    const createHandler = (req: Request, res: Response, next): void => {
      const params: Params = getParams(req)
      const body = req.body

      if (service.create !== undefined) {
        service
          .create(body, params)
          .then(data => res.status(200).json(data))
          .catch(err => next(err))
      } else {
        res.status(200).send('Not implementd')
      }
    }

    const updateHandler = (req: Request, res: Response, next): void => {
      const id: Id = req.params.id
      const params: Params = getParams(req)
      const body = req.body

      if (service.update !== undefined) {
        service
          .update(id, body, params)
          .then(data => res.status(200).json(data))
          .catch(err => next(err))
      } else {
        res.status(200).send('Not implemented')
      }
    }

    expressApp.get(path, findHandler)
    expressApp.get(path + '/:id', getHandler)
    expressApp.post(path, createHandler)
    expressApp.post(path + '/:id', updateHandler)
  }

  function init (app: Application & AppExpress): void {
    app.requirePlugin('config', name)
    app.listen = listen

    app.events.newService.subscribe(({ key, service }) => {
      mountService('/' + key, service)
    })
  }

  return {
    name,
    init
  }
}
