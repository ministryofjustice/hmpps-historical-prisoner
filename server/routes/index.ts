import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { Services, services } from '../services'
import disclaimerRoutes from './disclaimer/disclaimer'
import searchRoutes from './search/search'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ auditService, historicalPrisonerService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.redirect('/disclaimer')
  })

  disclaimerRoutes(router, auditService)
  searchRoutes(router, auditService, historicalPrisonerService)

  return router
}
