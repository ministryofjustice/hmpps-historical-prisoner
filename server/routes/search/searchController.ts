import { Request, Response } from 'express'
import { PrisonerSearchForm } from 'express-session'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import logger from '../../../logger'
import AuditService, { Page } from '../../services/auditService'
import trimForm from '../../utils/trim'

import {
  FindPrisonersByAddress,
  FindPrisonersByIdentifiers,
  FindPrisonersByName,
  PagedModelPrisonerSearchDto,
  PageMetaData,
} from '../../@types/historical-prisoner/historicalPrisonerApiTypes'
import { LegacyPagination, pagination } from '../../utils/pagination'

export default class SearchController {
  constructor(
    private readonly historicalPrisonerService: HistoricalPrisonerService,
    private readonly auditService: AuditService,
  ) {}

  async clearSearch(req: Request, res: Response): Promise<void> {
    logger.debug('GET /search')
    await this.auditService.logPageView(Page.SEARCH, { who: res.locals.user.username, correlationId: req.id })
    req.session.searchParams = {}

    return res.render('pages/search', { form: { searchType: 'name' } })
  }

  async getSearch(req: Request, res: Response): Promise<void> {
    logger.debug('GET /search')
    await this.auditService.logPageView(Page.SEARCH, { who: res.locals.user.username, correlationId: req.id })

    if (!req.session.prisonerSearchForm) {
      return res.render('pages/search', { form: { searchType: 'name' } })
    }

    // const { page, filters } = req.query
    const { page } = req.query

    if (page) {
      req.session.searchParams.page = Number(page) - 1
    }
    const pagedResults: PagedModelPrisonerSearchDto = await this.doSearch(req, res)
    const paginationParams = this.getPaginationParams(req, pagedResults.page)

    if (req.session.prisonerSearchForm.searchType === undefined) {
      req.session.prisonerSearchForm = { searchType: 'name' }
    }
    return res.render('pages/search', {
      searchResults: pagedResults.content,
      form: req.session.prisonerSearchForm,
      paginationParams,
    })
  }

  async postSearch(req: Request, res: Response): Promise<void> {
    logger.debug('post search /')
    // TODO Validate form
    req.session.searchParams ??= {}

    req.session.prisonerSearchForm = { ...trimForm(req.body) }
    logger.debug('search form is', req.session.prisonerSearchForm)

    const pagedResults: PagedModelPrisonerSearchDto = await this.doSearch(req, res)

    const paginationParams = this.getPaginationParams(req, pagedResults.page)
    logger.debug('paginationParams', paginationParams)
    return res.render('pages/search', {
      searchResults: pagedResults.content,
      form: req.session.prisonerSearchForm,
      paginationParams,
    })
  }

  async doSearch(req: Request, res: Response): Promise<PagedModelPrisonerSearchDto> {
    const { prisonerSearchForm } = req.session

    switch (prisonerSearchForm.searchType) {
      case 'name':
        return this.historicalPrisonerService.findPrisonersByName(
          req.user.token,
          SearchController.toPrisonersByName(prisonerSearchForm),
          req.session.searchParams.page,
        )
      case 'identifier':
        return this.historicalPrisonerService.findPrisonersByIdentifiers(
          req.user.token,
          SearchController.toPrisonersByIdentifiers(prisonerSearchForm),
          req.session.searchParams.page,
        )
      case 'address':
        return this.historicalPrisonerService.findPrisonersByAddressTerms(
          req.user.token,
          SearchController.toPrisonersByAddress(prisonerSearchForm),
          req.session.searchParams.page,
        )
      default:
        throw new Error(`Unknown search type: ${prisonerSearchForm.searchType}`)
    }
  }

  getPaginationParams(req: Request, page: PageMetaData): LegacyPagination {
    // const filters = req.session.searchParams.filters ? `&filters=${req.session.searchParams.filters}` : ''
    // const paginationUrlPrefix = `/search/results?${filters}&`
    const paginationUrlPrefix = `/search?`

    const paginationParams = pagination(
      page.number + 1,
      page.totalPages,
      paginationUrlPrefix,
      'moj',
      page.totalElements,
      page.size,
    )
    paginationParams.results.text = 'prisoners'
    return paginationParams
  }

  private static toPrisonersByName(form: PrisonerSearchForm): FindPrisonersByName {
    const hasDateField = form['dob-day'] && form['dob-month'] && form['dob-year']
    return {
      forename: form.firstName,
      surname: form.lastName,
      dateOfBirth: hasDateField ? [form['dob-year'], form['dob-month'], form['dob-day']].join('-') : undefined,
      ageFrom: Number(form.age?.split('-')[0]) || Number(form.age) || undefined,
      ageTo: Number(form.age?.split('-')[1]) || undefined,

      gender: undefined,
      hdc: form.hdc,
      lifer: form.lifer,
    }
  }

  private static toPrisonersByIdentifiers(form: PrisonerSearchForm): FindPrisonersByIdentifiers {
    return {
      prisonNumber: form.prisonNumber,
      pnc: form.pncNumber,
      cro: form.croNumber,

      gender: null,
      hdc: form.hdc,
      lifer: form.lifer,
    }
  }

  private static toPrisonersByAddress(form: PrisonerSearchForm): FindPrisonersByAddress {
    return {
      addressTerms: form.address,

      gender: null,
      hdc: form.hdc,
      lifer: form.lifer,
    }
  }
}
