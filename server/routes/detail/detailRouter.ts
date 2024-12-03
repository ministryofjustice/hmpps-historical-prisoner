import type { RequestHandler, Router } from 'express'

import AuditService from '../../services/auditService'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import DetailController from './detailController'

export default function routes(
  router: Router,
  auditService: AuditService,
  historicalPrisonerService: HistoricalPrisonerService,
): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const detailController = new DetailController(historicalPrisonerService, auditService)

  get('/detail/:prisonNo', async (req, res, next) => detailController.getDetail(req, res))

  return router
}
