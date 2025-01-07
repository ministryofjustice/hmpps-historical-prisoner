import type { RequestHandler, Router } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import SuggestionsController from './suggestionsController'

export default function routes(router: Router): Router {
  const get = (path: string, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const suggestionsController = new SuggestionsController()

  get('/suggestions', async (req, res, next) => suggestionsController.getSuggestions(req, res))
  get('/suggestion', async (req, res, next) => suggestionsController.applySuggestions(req, res))

  return router
}
