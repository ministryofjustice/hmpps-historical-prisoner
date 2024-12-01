import { Request, Response } from 'express'
import { PrisonerSearchForm } from 'express-session'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import logger from '../../../logger'
import AuditService, { Page } from '../../services/auditService'
import trimForm from '../../utils/trim'
import { FindPrisonersByName } from '../../@types/historical-prisoner/historicalPrisonerApiTypes'

export default class SearchController {
  constructor(
    private readonly historicalPrisonerService: HistoricalPrisonerService,
    private readonly auditService: AuditService,
  ) {}

  async getSearch(req: Request, res: Response): Promise<void> {
    logger.debug('search /')
    await this.auditService.logPageView(Page.SEARCH, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/search', { form: req.session.prisonerSearchForm })
  }

  async postSearch(req: Request, res: Response): Promise<void> {
    logger.debug('post search /')
    // TODO Validate form

    const prisonerSearchForm = req.body
    req.session.prisonerSearchForm = { ...trimForm(req.body) }
    logger.debug('searchform is', req.session.prisonerSearchForm)

    if (prisonerSearchForm.searchType === 'name') {
      const prisonersByNameForm = SearchController.toPrisonersByName(prisonerSearchForm)
      const { content } = await this.historicalPrisonerService.findPrisonersByName(req.user.token, prisonersByNameForm)
      res.render('pages/search', { searchResults: content, form: req.session.prisonerSearchForm })
    } else if (prisonerSearchForm.searchType === 'identifier') {
      const { content } = await this.historicalPrisonerService.findPrisonersByIdentifiers(
        req.user.token,
        prisonerSearchForm,
      )
      res.render('pages/search', { searchResults: content, form: req.session.prisonerSearchForm })
    } else if (prisonerSearchForm.searchType === 'address') {
      const { content } = await this.historicalPrisonerService.findPrisonersByAddressTerms(
        req.user.token,
        prisonerSearchForm,
      )
      res.render('pages/search', { searchResults: content, form: req.session.prisonerSearchForm })
    }
  }

  private static toPrisonersByName(form: PrisonerSearchForm): FindPrisonersByName {
    // TODO Format all fields correctly
    return {
      forename: form.firstName,
      surname: form.lastName,
      dateOfBirth: form.dob,
      ageFrom: Number(form.ageRange?.split('-')[0]),
      ageTo: Number(form.ageRange?.split('-')[1]),
      gender: form.gender,
      hdc: form.hdc,
      lifer: form.lifer,
    }
  }
}
