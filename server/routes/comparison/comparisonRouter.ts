import type { RequestHandler, Router } from 'express'

import AuditService from '../../services/auditService'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import ComparisonController from './comparisonController'

export default function routes(
  router: Router,
  auditService: AuditService,
  historicalPrisonerService: HistoricalPrisonerService,
): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const comparisonController = new ComparisonController(historicalPrisonerService, auditService)

  get('/comparison', async (req, res, next) => comparisonController.getComparisonDetail(req, res))

  return router
}
