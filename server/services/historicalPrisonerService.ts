import HistoricalPrisonerApiClient from '../data/historicalPrisonerApiClient'
import { PagedModelPrisoner } from '../@types/historical-prisoner/historicalPrisonerApiTypes'

export default class HistoricalPrisonerService {
  constructor(private readonly historicalPrisonerApiClient: HistoricalPrisonerApiClient) {}

  async findPrisonersByName(
    token: string,

    nameSearchForm: {
      forename?: string
      surname?: string
      dateOfBirth?: string
      page?: number
    },
  ): Promise<PagedModelPrisoner> {
    return this.historicalPrisonerApiClient.findPrisonersByNameOrAge(token, nameSearchForm)
  }

  async findPrisonersWithIdentifiers(
    token: string,
    identifierSearchForm: {
      prisonerNumber?: string
      pncNumber?: string
      croNumber?: string
      sort: string
      page: number
      size: number
    },
  ): Promise<PagedModelPrisoner> {
    return this.historicalPrisonerApiClient.findPrisonersByIdentifiers(token, identifierSearchForm)
  }
}
