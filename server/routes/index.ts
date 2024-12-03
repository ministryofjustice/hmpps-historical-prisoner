import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { Services } from '../services'
import disclaimerRoutes from './disclaimer/disclaimer'
import searchRoutes from './search/searchRouter'
import printRoutes from './print/printRouter'
import detailRoutes from './detail/detailRouter'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ auditService, historicalPrisonerService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    return res.redirect('/search')
  })

  disclaimerRoutes(router, auditService)
  searchRoutes(router, auditService, historicalPrisonerService)
  detailRoutes(router, auditService, historicalPrisonerService)
  printRoutes(router, auditService, historicalPrisonerService)

  return router
}
