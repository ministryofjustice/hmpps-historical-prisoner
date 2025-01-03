import { Request, Response } from 'express'
import { PrisonerSearchForm } from 'express-session'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import AuditService, { Page } from '../../services/auditService'
import trimForm from '../../utils/trim'
import searchValidator from './searchValidator'

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
    await this.auditService.logPageView(Page.SEARCH, { who: res.locals.user.username, correlationId: req.id })
    req.session.searchParams = {}

    return res.render('pages/search', { form: { searchType: 'name' } })
  }

  async getSearch(req: Request, res: Response): Promise<void> {
    await this.auditService.logPageView(Page.SEARCH, { who: res.locals.user.username, correlationId: req.id })

    if (!req.session.prisonerSearchForm) {
      return res.render('pages/search', { form: { searchType: 'name' } })
    }

    const { page } = req.query
    req.session.searchParams.filters = this.getFiltersFromQuery(req)

    if (page) {
      req.session.searchParams.page = Number(page) - 1
    }
    const pagedResults: PagedModelPrisonerSearchDto = await this.doSearch(req, res)
    const paginationParams = this.getPaginationParams(req, pagedResults.page, this.getSessionFilterString(req))

    if (req.session.prisonerSearchForm.searchType === undefined) {
      req.session.prisonerSearchForm = { searchType: 'name' }
    }
    return res.render('pages/search', {
      searchResults: pagedResults.content.map(prisoner => {
        return { ...prisoner, shortlisted: req.session.shortlist?.includes(prisoner.prisonNumber) }
      }),
      form: req.session.prisonerSearchForm,
      paginationParams,
      filters: req.session.searchParams.filters,
      shortlist: req.session.shortlist,
    })
  }

  async postSearch(req: Request, res: Response): Promise<void> {
    req.session.searchParams ??= {}

    req.session.prisonerSearchForm = { ...trimForm(req.body) }

    const errors = searchValidator(req.session.prisonerSearchForm)
    if (errors.length) {
      return res.render('pages/search', {
        form: req.session.prisonerSearchForm,
        errors,
      })
    }

    // Page and Search Filters are cleared on post
    req.session.searchParams.filters = []
    req.session.searchParams.page = 0

    const pagedResults: PagedModelPrisonerSearchDto = await this.doSearch(req, res)
    const paginationParams = this.getPaginationParams(req, pagedResults.page, '')

    return res.render('pages/search', {
      searchResults: pagedResults.content,
      form: req.session.prisonerSearchForm,
      paginationParams,
      filters: [],
      errors,
    })
  }

  async doSearch(req: Request, _: Response): Promise<PagedModelPrisonerSearchDto> {
    const { prisonerSearchForm } = req.session

    switch (prisonerSearchForm.searchType) {
      case 'name':
        return this.historicalPrisonerService.findPrisonersByName(
          req.user.token,
          SearchController.toPrisonersByName(prisonerSearchForm, req.session.searchParams.filters),
          req.session.searchParams.page,
        )
      case 'identifier':
        return this.historicalPrisonerService.findPrisonersByIdentifiers(
          req.user.token,
          SearchController.toPrisonersByIdentifiers(prisonerSearchForm, req.session.searchParams.filters),
          req.session.searchParams.page,
        )
      case 'address':
        return this.historicalPrisonerService.findPrisonersByAddressTerms(
          req.user.token,
          SearchController.toPrisonersByAddress(prisonerSearchForm, req.session.searchParams.filters),
          req.session.searchParams.page,
        )
      default:
        throw new Error(`Unknown search type: ${prisonerSearchForm.searchType}`)
    }
  }

  getSuggestions(req: Request, res: Response) {
    // TODO
    return res.render('pages/suggestion')
  }

  getSessionFilterString(req: Request): string {
    const searchParams = new URLSearchParams()

    req.session.searchParams.filters?.forEach(entry => {
      searchParams.append('filters', entry)
    })
    return searchParams?.toString() ?? ''
  }

  getFiltersFromQuery(req: Request): string[] {
    const { filters } = req.query
    if (filters) {
      if (Array.isArray(filters)) {
        return filters as string[]
      }
      return [filters as string]
    }
    return []
  }

  getPaginationParams(req: Request, page: PageMetaData, filters: string): LegacyPagination {
    const paginationUrlPrefix = filters === '' ? '/search/results?' : `/search/results?${filters}&`

    const paginationParams = pagination(
      page.number + 1,
      page.totalPages,
      paginationUrlPrefix,
      'moj',
      page.totalElements,
      page.size,
    )
    paginationParams.results.text = page.totalElements === 1 ? 'prisoner' : 'prisoners'
    return paginationParams
  }

  addToShortlist(req: Request, res: Response) {
    req.session.shortlist ??= []
    if (req.session.shortlist.length === 3) {
      // already max items in shortlist - no more can be added
    }
    if (req.body.add) {
      req.session.shortlist.push(req.body.prisoner)
    } else if (req.body.remove) {
      req.session.shortlist = req.session.shortlist.filter(item => item !== req.body.prisoner)
    }
    // TODO add in view functionality to show shortlist

    // Need to add in MoJ banner too for success

    return res.redirect('/search/results')
  }

  private static toPrisonersByName(form: PrisonerSearchForm, filters: string[]): FindPrisonersByName {
    const hasDateField = form.dobDay && form.dobMonth && form.dobYear
    let gender: string
    if (filters) {
      if (filters.includes('male') && !filters.includes('female')) gender = 'M'
      else if (!filters.includes('male') && filters.includes('female')) gender = 'F'
    }

    return {
      forename: form.firstName,
      surname: form.lastName,
      dateOfBirth: hasDateField
        ? [form.dobYear, form.dobMonth.padStart(2, '0'), form.dobDay.padStart(2, '0')].join('-')
        : undefined,
      ageFrom: Number(form.age?.split('-')[0]) || Number(form.age) || undefined,
      ageTo: Number(form.age?.split('-')[1]) || undefined,
      gender,
      hdc: filters?.includes('hdc') ? true : undefined,
      lifer: filters?.includes('lifer') ? true : undefined,
    }
  }

  private static toPrisonersByIdentifiers(form: PrisonerSearchForm, filters: string[]): FindPrisonersByIdentifiers {
    return {
      prisonNumber: form.prisonNumber,
      pnc: form.pncNumber,
      cro: form.croNumber,

      gender: undefined,
      hdc: filters?.includes('hdc') ? true : undefined,
      lifer: filters?.includes('lifer') ? true : undefined,
    }
  }

  private static toPrisonersByAddress(form: PrisonerSearchForm, filters: string[]): FindPrisonersByAddress {
    return {
      addressTerms: form.address,

      gender: undefined,
      hdc: filters?.includes('hdc') ? true : undefined,
      lifer: filters?.includes('lifer') ? true : undefined,
    }
  }
}
