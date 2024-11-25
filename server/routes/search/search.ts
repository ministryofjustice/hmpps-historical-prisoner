import type { RequestHandler, Router } from 'express'

import logger from '../../../logger'

import AuditService, { Page } from '../../services/auditService'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'

export default function routes(
  router: Router,
  auditService: AuditService,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  historicalPrisonerService: HistoricalPrisonerService,
): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  // const controller = new SearchController(historicalPrisonerService)

  get('/search', async (req, res, next) => {
    logger.debug('search /')
    if (req.session.disclaimerConfirmed) {
      await auditService.logPageView(Page.SEARCH, { who: res.locals.user.username, correlationId: req.id })

      res.render('pages/search')
    } else {
      res.render('pages/disclaimer')
    }
  })

  post('/search', async (req, res) => {
    logger.debug('post search /')
    // const { content } = await this.historicalPrisonerService.findPrisonersWithIdentifiers(
    //   req.user.token,
    // req.session.prisonerSearchForm,
    // )
    res.render('pages/search')
  })

  return router
}
