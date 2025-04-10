import nock from 'nock'
import HistoricalPrisonerApiClient from './historicalPrisonerApiClient'
import config from '../config'
import {
  FindPrisonersByName,
  FindPrisonersByIdentifiers,
  PagedModelPrisonerSearchDto,
  PrisonerDetailDto,
  FindPrisonersByAddress,
} from '../@types/historical-prisoner/historicalPrisonerApiTypes'

describe('HistoricalPrisonerApiClient', () => {
  const token = 'test-token'
  let fakeApi: nock.Scope
  let apiClient: HistoricalPrisonerApiClient

  beforeEach(() => {
    fakeApi = nock(config.apis.historicalPrisonerApi.url)
    apiClient = new HistoricalPrisonerApiClient()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('findPrisonersByName', () => {
    it('returns paged model of prisoners by name', async () => {
      const prisonersByNameForm: FindPrisonersByName = { forename: 'John', surname: 'Doe' }
      const expectedResponse: PagedModelPrisonerSearchDto = { content: [], page: { totalElements: 0 } }

      fakeApi
        .get('/search?forename=John&surname=Doe&page=')
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, expectedResponse)

      const result = await apiClient.findPrisonersByName(token, prisonersByNameForm)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('findPrisonersByIdentifiers', () => {
    it('returns paged model of prisoners by identifiers', async () => {
      const prisonersByIdentifiersForm: FindPrisonersByIdentifiers = { prisonNumber: 'A1234BC' }
      const expectedResponse: PagedModelPrisonerSearchDto = { content: [], page: { totalElements: 0 } }

      fakeApi
        .get('/identifiers?prisonNumber=A1234BC&page=')
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, expectedResponse)

      const result = await apiClient.findPrisonersByIdentifiers(token, prisonersByIdentifiersForm)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('findPrisonersByAddressTerms', () => {
    it('returns paged model of prisoners by address terms', async () => {
      const prisonersByAddressForm: FindPrisonersByAddress = { addressTerms: '123 Main & St' }
      const expectedResponse: PagedModelPrisonerSearchDto = { content: [], page: { totalElements: 0 } }

      fakeApi
        .get('/address-lookup?addressTerms=123 Main %26 St&page=')
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, expectedResponse)

      const result = await apiClient.findPrisonersByAddressTerms(token, prisonersByAddressForm)

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

      fakeApi.get('/detail/A1234BC').matchHeader('authorization', `Bearer ${token}`).reply(200, expectedResponse)

      const result = await apiClient.getPrisonerDetail(token, prisonNumber)

      expect(result).toEqual(expectedResponse)
    })
  })
})
