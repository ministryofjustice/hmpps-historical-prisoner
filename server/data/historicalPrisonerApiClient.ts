import config from '../config'
import RestClient from './restClient'
import { PagedModelPrisoner } from '../@types/historical-prisoner/historicalPrisonerApiTypes'

export default class HistoricalPrisonerApiClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Historical Prisoner Api Client', config.apis.historicalPrisonerApi, token)
  }

  findPrisonersWithIdentifiers(
    token: string,
    {
      prisonerNumber,
      pnc,
      cro,
      page,
    }: {
      prisonerNumber?: string
      pnc?: string
      cro?: string
      page: number
    },
  ): Promise<PagedModelPrisoner> {
    return HistoricalPrisonerApiClient.restClient(token).get<PagedModelPrisoner>({
      path: `/identifiers?prisonNumber=${prisonerNumber}&pnc=${pnc}&cro=${cro}&page=${page}`,
    })
  }
}
