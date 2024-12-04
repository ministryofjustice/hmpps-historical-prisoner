import { Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import DisclaimerController from './disclaimerController'

export default function routes(router: Router): Router {
  const disclaimerController = new DisclaimerController()

  router.get(
    '/disclaimer',
    asyncMiddleware((req, res) => disclaimerController.getDisclaimer(req, res)),
  )
  router.post(
    '/disclaimer',
    asyncMiddleware((req, res) => disclaimerController.postDisclaimer(req, res)),
  )

  return router
}
