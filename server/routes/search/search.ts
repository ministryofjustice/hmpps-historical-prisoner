import type { RequestHandler, Router } from 'express'

import logger from '../../../logger'

import AuditService, { Page } from '../../services/auditService'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'

export default function routes(
  router: Router,
  auditService: AuditService,
  historicalPrisonerService: HistoricalPrisonerService,
): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  // const controller = new SearchController(historicalPrisonerService)

  get('/search', async (req, res, next) => {
    logger.debug('search /')
    await auditService.logPageView(Page.SEARCH, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/search')
  })

  post('/search', async (req, res) => {
    logger.debug('post search /')
    const prisonerSearchForm = req.body

    if (prisonerSearchForm.searchType) {
      logger.debug('searchType', prisonerSearchForm.searchType)
      const { content } = await historicalPrisonerService.findPrisonersByName(req.user.token, prisonerSearchForm)

      logger.debug('content returned from search', content)
      res.render('pages/search', { searchResults: content })
    }
  })

  return router
}
