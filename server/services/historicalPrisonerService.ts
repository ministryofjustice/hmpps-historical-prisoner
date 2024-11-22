import HistoricalPrisonerApiClient from '../data/historicalPrisonerApiClient'
import { PagedModelPrisoner } from '../@types/historical-prisoner/historicalPrisonerApiTypes'

export default class HistoricalPrisonerService {
  constructor(private readonly historicalPrisonerApiClient: HistoricalPrisonerApiClient) {}

  async findPrisonersWithIdentifiers(
    token: string,
    searchParams: {
      prisonerNumber?: string
      pnc?: string
      cro?: string
      sort: string
      page: number
      size: number
    },
  ): Promise<PagedModelPrisoner> {
    const { ...queryParams } = searchParams
    return this.historicalPrisonerApiClient.findPrisonersWithIdentifiers(token, queryParams)
  }
}
