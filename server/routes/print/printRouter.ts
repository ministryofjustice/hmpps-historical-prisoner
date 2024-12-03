import type { RequestHandler, Router } from 'express'

import AuditService from '../../services/auditService'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import PrintController from './printController'

export default function routes(
  router: Router,
  auditService: AuditService,
  historicalPrisonerService: HistoricalPrisonerService,
): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const printController = new PrintController(historicalPrisonerService, auditService)

  get('/print/:prisonNo', async (req, res, next) => printController.getDetail(req, res))

  return router
}
