import HistoricalPrisonerService from './historicalPrisonerService'
import {
  FindPrisonersByName,
  FindPrisonersByIdentifiers,
  PagedModelPrisonerSearchDto,
  PrisonerDetailDto,
  FindPrisonersByAddress,
} from '../@types/historical-prisoner/historicalPrisonerApiTypes'
import HistoricalPrisonerApiClient from '../data/historicalPrisonerApiClient'

jest.mock('../data/historicalPrisonerApiClient')

describe('HistoricalPrisonerService', () => {
  const token = 'test-token'
  const apiClient = new HistoricalPrisonerApiClient() as jest.Mocked<HistoricalPrisonerApiClient>
  let service: HistoricalPrisonerService

  beforeEach(() => {
    service = new HistoricalPrisonerService(apiClient)
  })

  describe('findPrisonersByName', () => {
    it('returns paged model of prisoners by name', async () => {
      const prisonersByNameForm: FindPrisonersByName = { forename: 'John', surname: 'Doe' }
      const expectedResponse: PagedModelPrisonerSearchDto = { content: [], page: { totalElements: 0 } }

      apiClient.findPrisonersByName.mockResolvedValue(expectedResponse)

      const result = await service.findPrisonersByName(token, prisonersByNameForm)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('findPrisonersByIdentifiers', () => {
    it('returns paged model of prisoners by identifiers', async () => {
      const prisonersByIdentifiersForm: FindPrisonersByIdentifiers = { prisonNumber: 'A1234BC' }
      const expectedResponse: PagedModelPrisonerSearchDto = { content: [], page: { totalElements: 0 } }

      apiClient.findPrisonersByIdentifiers.mockResolvedValue(expectedResponse)

      const result = await service.findPrisonersByIdentifiers(token, prisonersByIdentifiersForm)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('findPrisonersByAddressTerms', () => {
    it('returns paged model of prisoners by address terms', async () => {
      const prisonersByAddressForm: FindPrisonersByAddress = { addressTerms: '123 Main & St' }
      const expectedResponse: PagedModelPrisonerSearchDto = { content: [], page: { totalElements: 0 } }

      apiClient.findPrisonersByAddressTerms.mockResolvedValue(expectedResponse)

      const result = await service.findPrisonersByAddressTerms(token, prisonersByAddressForm)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('getPrisonerDetail', () => {
    it('returns prisoner detail by prison number', async () => {
      const prisonNumber = 'A1234BC'
      const expectedResponse: PrisonerDetailDto = {
        prisonNumber: 'A1234BC',
        summary: { prisonNumber: 'A1234BC', firstName: 'John', lastName: 'Doe' },
      }

      apiClient.getPrisonerDetail.mockResolvedValue(expectedResponse)

      const result = await service.getPrisonerDetail(token, prisonNumber)

      expect(result).toEqual(expectedResponse)
    })
  })
})
