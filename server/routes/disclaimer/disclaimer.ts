import type { RequestHandler, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import AuditService, { Page } from '../../services/auditService'
import HmppsError from '../../interfaces/HmppsError'
import logger from '../../../logger'

export default function routes(router: Router, auditService: AuditService): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/disclaimer', async (req, res, next) => {
    if (req.session.disclaimerConfirmed) {
      res.redirect('search')
    } else {
      await auditService.logPageView(Page.LOG_IN, { who: res.locals.user.username, correlationId: req.id })
      res.render('pages/disclaimer')
    }
  })

  post('/disclaimer', async (req, res) => {
    if (!req.body.disclaimer) {
      res.status(400)
      const errors: HmppsError[] = [
        { href: '#disclaimer', text: 'You must confirm that you understand the disclaimer' },
      ]
      res.render('pages/disclaimer', { errors })
    } else {
      req.session.disclaimerConfirmed = true
      logger.info('Disclaimer accepted - redirecting to search', { userId: res.locals.user.username })
      await auditService.logPageView(Page.DISCLAIMER_ACCEPTED, { who: res.locals.user.username, correlationId: req.id })
      res.redirect('/search')
    }
  })

  return router
}
