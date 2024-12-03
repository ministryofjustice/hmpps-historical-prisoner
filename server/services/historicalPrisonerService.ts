import querystring from 'querystring'
import {
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
  ): Promise<PagedModelPrisonerSearchDto> {
    return HistoricalPrisonerService.restClient(token).get<PagedModelPrisonerSearchDto>({
      path: '/search',
      query: querystring.stringify({ ...prisonersByNameForm, size: 10 }),
    })
  }

  async findPrisonersByIdentifiers(
    token: string,
    prisonersByIdentifiersForm: FindPrisonersByIdentifiers,
  ): Promise<PagedModelPrisonerSearchDto> {
    return HistoricalPrisonerService.restClient(token).get<PagedModelPrisonerSearchDto>({
      path: '/identifiers',
      query: querystring.stringify({ ...prisonersByIdentifiersForm }),
    })
  }

  async findPrisonersByAddressTerms(token: string, addressTerms: string): Promise<PagedModelPrisonerSearchDto> {
    return HistoricalPrisonerService.restClient(token).get<PagedModelPrisonerSearchDto>({
      path: '/address-lookup',
      query: { addressTerms },
    })
  }

  async getPrisonerDetail(token: string, prisonNumber: string): Promise<PrisonerDetailDto> {
    return HistoricalPrisonerService.restClient(token).get<PrisonerDetailDto>({
      path: `/detail/${prisonNumber}`,
    })
  }
}
