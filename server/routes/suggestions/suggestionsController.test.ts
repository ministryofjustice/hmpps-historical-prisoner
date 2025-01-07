import { Request, Response } from 'express'

import SuggestionsController from './suggestionsController'
import { SuggestionFields } from '../../utils/suggestionHelpers'

const controller = new SuggestionsController()

describe('Suggestions controller', () => {
  let req: Request
  let res: Response

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { token: 'token' },
      session: {},
      body: {},
    } as unknown as Request
    res = {
      locals: { user: { username: 'user' } },
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn(),
    } as unknown as Response
  })

  describe('getSuggestions', () => {
    const noSuggestions: SuggestionFields = { firstName: [], lastName: [], age: [] }

    it('should render the suggestions page', () => {
      // TODO: add more tests and cope with no search form in session
      req.session.prisonerSearchForm = { searchType: 'name' }
      controller.getSuggestions(req, res)

      expect(res.render).toHaveBeenCalledWith('pages/suggestion', { suggestions: noSuggestions })
    })
  })
})
