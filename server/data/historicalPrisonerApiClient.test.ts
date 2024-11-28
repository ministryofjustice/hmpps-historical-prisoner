import nock from 'nock'

import config from '../config'
import HistoricalPrisonerApiClient from './historicalPrisonerApiClient'

jest.mock('./tokenStore/redisTokenStore')

const token = { access_token: 'token-1', expires_in: 300 }

describe('historicalPrisonerApiClient', () => {
  let fakeHistoricalPrisonerApiClient: nock.Scope
  let historicalPrisonerApiClient: HistoricalPrisonerApiClient

  beforeEach(() => {
    fakeHistoricalPrisonerApiClient = nock(config.apis.historicalPrisonerApi.url)
    historicalPrisonerApiClient = new HistoricalPrisonerApiClient()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('identifiers', () => {
    it('should return data from api', async () => {
      const response = { data: 'data' }

      fakeHistoricalPrisonerApiClient
        .get('/identifiers?prisonNumber=A1234BC&pnc=456&cro=789&page=1')
        .matchHeader('authorization', `Bearer ${token.access_token}`)
        .reply(200, response)

      const output = await historicalPrisonerApiClient.findPrisonersByIdentifiers(token.access_token, {
        prisonNumber: 'A1234BC',
        pncNumber: '456',
        cro: '789',
        page: 1,
      })

      expect(output).toEqual(response)
    })
  })
})
