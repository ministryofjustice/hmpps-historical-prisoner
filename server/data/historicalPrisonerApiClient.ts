import config from '../config'
import RestClient from './restClient'
import { PagedModelPrisoner } from '../@types/historical-prisoner/historicalPrisonerApiTypes'
import logger from '../../logger'

export default class HistoricalPrisonerApiClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Historical Prisoner Api Client', config.apis.historicalPrisonerApi, token)
  }

  async findPrisonersByNameOrAge(
    token: string,
    {
      firstName,
      lastName,
      dateOfBirth,
      ageFrom,
      ageTo,
      hdc = false,
      lifer = false,
      gender,
      page,
    }: {
      firstName?: string
      lastName?: string
      dateOfBirth?: string
      ageFrom?: string
      ageTo?: string
      hdc?: boolean
      lifer?: boolean
      gender?: string
      page?: number
    },
  ): Promise<PagedModelPrisoner> {
    logger.debug(`getting prisoner search details by name/age for `, {
      firstName,
      lastName,
      dateOfBirth,
      ageFrom,
      ageTo,
      hdc,
      lifer,
      gender,
      page,
    })

    return HistoricalPrisonerApiClient.restClient(token).get<PagedModelPrisoner>({
      // TODO add in other params
      path: `/search?forename=${firstName ?? ''}&surname=${lastName ?? ''}&page=${page ?? 0}`,
    })
  }

  async findPrisonersByIdentifiers(
    token: string,
    {
      prisonNumber,
      pncNumber,
      cro,
      page,
    }: {
      prisonNumber?: string
      pncNumber?: string
      cro?: string
      page?: number
    },
  ): Promise<PagedModelPrisoner> {
    logger.debug(`getting prisoner search details`)

    return HistoricalPrisonerApiClient.restClient(token).get<PagedModelPrisoner>({
      path: `/identifiers?prisonNumber=${prisonNumber ?? ''}&pnc=${pncNumber ?? ''}&cro=${cro ?? ''}&page=${page ?? ''}`,
    })
  }

  async findPrisonersByAddress(token: string): Promise<string[]> {
    logger.debug(`getting prisoner search details by address`)

    return HistoricalPrisonerApiClient.restClient(token).get<string[]>({
      path: `/address-lookup?addressTerms=Hill Valley`,
    })
  }
}
