import type { RequestHandler, Router } from 'express'

import AuditService from '../../services/auditService'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import SearchController from './searchController'

export default function routes(
  router: Router,
  auditService: AuditService,
  historicalPrisonerService: HistoricalPrisonerService,
): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const searchController = new SearchController(historicalPrisonerService, auditService)

  get('/search', async (req, res, next) => searchController.clearSearch(req, res))
  get('/search/results', async (req, res, next) => searchController.getSearch(req, res))
  post('/search', async (req, res) => searchController.postSearch(req, res))
  get('/search/suggestions', async (req, res, next) => searchController.getSuggestions(req, res))

  return router
}
