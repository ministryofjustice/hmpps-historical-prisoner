import nock from 'nock'
import HistoricalPrisonerService from './historicalPrisonerService'
import config from '../config'
import {
  FindPrisonersByName,
  FindPrisonersByIdentifiers,
  PagedModelPrisonerSearchDto,
  PrisonerDetailDto,
} from '../@types/historical-prisoner/historicalPrisonerApiTypes'

describe('HistoricalPrisonerService', () => {
  const token = 'test-token'
  let fakeApi: nock.Scope
  let service: HistoricalPrisonerService

  beforeEach(() => {
    fakeApi = nock(config.apis.historicalPrisonerApi.url)
    service = new HistoricalPrisonerService()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('findPrisonersByName', () => {
    it('returns paged model of prisoners by name', async () => {
      const prisonersByNameForm: FindPrisonersByName = { forename: 'John', surname: 'Doe' }
      const expectedResponse: PagedModelPrisonerSearchDto = { content: [], page: { totalElements: 0 } }

      fakeApi
        .get('/search?forename=John&surname=Doe&size=10')
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, expectedResponse)

      const result = await service.findPrisonersByName(token, prisonersByNameForm)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('findPrisonersByIdentifiers', () => {
    it('returns paged model of prisoners by identifiers', async () => {
      const prisonersByIdentifiersForm: FindPrisonersByIdentifiers = { prisonNumber: 'A1234BC' }
      const expectedResponse: PagedModelPrisonerSearchDto = { content: [], page: { totalElements: 0 } }

      fakeApi
        .get('/identifiers?prisonNumber=A1234BC')
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, expectedResponse)

      const result = await service.findPrisonersByIdentifiers(token, prisonersByIdentifiersForm)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('findPrisonersByAddressTerms', () => {
    it('returns paged model of prisoners by address terms', async () => {
      const addressTerms = '123 Main & St'
      const expectedResponse: PagedModelPrisonerSearchDto = { content: [], page: { totalElements: 0 } }

      fakeApi
        .get('/address-lookup?addressTerms=123 Main %26 St')
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, expectedResponse)

      const result = await service.findPrisonersByAddressTerms(token, addressTerms)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('getPrisonerDetail', () => {
    it('returns prisoner detail by prison number', async () => {
      const prisonNumber = 'A1234BC'
      const expectedResponse: PrisonerDetailDto = {
        prisonNumber: 'A1234BC',
        personalDetails: { prisonNumber: 'A1234BC', firstName: 'John', lastName: 'Doe' },
      }

      fakeApi
        .get('/detail?prisonNumber=A1234BC')
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, expectedResponse)

      const result = await service.getPrisonerDetail(token, prisonNumber)

      expect(result).toEqual(expectedResponse)
    })
  })
})
