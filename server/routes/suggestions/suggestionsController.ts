import { Request, Response } from 'express'
import getSearchSuggestions from '../../utils/suggestionHelpers'

export default class SuggestionsController {
  constructor() {}

  getSuggestions(req: Request, res: Response) {
    return res.render('pages/suggestion', { suggestions: getSearchSuggestions(req.session.prisonerSearchForm) })
  }

  applySuggestions(req: Request, res: Response) {
    req.session.prisonerSearchForm.firstName = req.query.firstName as string
    req.session.prisonerSearchForm.lastName = req.query.lastName as string
    if (req.query.age) {
      req.session.prisonerSearchForm.age = req.query.age as string
      req.session.prisonerSearchForm.dobDay = null
      req.session.prisonerSearchForm.dobMonth = null
      req.session.prisonerSearchForm.dobYear = null
    }
    return res.redirect('/search/results')
  }
}
