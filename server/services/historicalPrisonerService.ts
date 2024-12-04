import querystring from 'querystring'
import {
  FindPrisonersByAddress,
  FindPrisonersByIdentifiers,
  FindPrisonersByName,
  PagedModelPrisonerSearchDto,
  PrisonerDetailDto,
} from '../@types/historical-prisoner/historicalPrisonerApiTypes'
import RestClient from '../data/restClient'
import config from '../config'

export default class HistoricalPrisonerService {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Historical Prisoner Api Client', config.apis.historicalPrisonerApi, token)
  }

  async findPrisonersByName(
    token: string,
    prisonersByNameForm: FindPrisonersByName,
    page: number = undefined,
  ): Promise<PagedModelPrisonerSearchDto> {
    return HistoricalPrisonerService.restClient(token).get<PagedModelPrisonerSearchDto>({
      path: '/search',
      query: querystring.stringify({ ...prisonersByNameForm, page }),
    })
  }

  async findPrisonersByIdentifiers(
    token: string,
    prisonersByIdentifiersForm: FindPrisonersByIdentifiers,
    page: number = undefined,
  ): Promise<PagedModelPrisonerSearchDto> {
    return HistoricalPrisonerService.restClient(token).get<PagedModelPrisonerSearchDto>({
      path: '/identifiers',
      query: querystring.stringify({ ...prisonersByIdentifiersForm, page }),
    })
  }

  async findPrisonersByAddressTerms(
    token: string,
    prisonersByAddress: FindPrisonersByAddress,
    page: number = undefined,
  ): Promise<PagedModelPrisonerSearchDto> {
    return HistoricalPrisonerService.restClient(token).get<PagedModelPrisonerSearchDto>({
      path: '/address-lookup',
      query: querystring.stringify({ ...prisonersByAddress, page }),
    })
  }

  async getPrisonerDetail(token: string, prisonNumber: string): Promise<PrisonerDetailDto> {
    return HistoricalPrisonerService.restClient(token).get<PrisonerDetailDto>({
      path: `/detail/${prisonNumber}`,
    })
  }
}
