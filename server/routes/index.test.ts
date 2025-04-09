import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService from '../services/auditService'
import HistoricalPrisonerService from '../services/historicalPrisonerService'

jest.mock('../services/auditService')
jest.mock('../services/historicalPrisonerService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const historicalPrisonerService = new HistoricalPrisonerService(null) as jest.Mocked<HistoricalPrisonerService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      historicalPrisonerService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should redirect to disclaimer page', () => {
    return request(app)
      .get('/')
      .expect(res => {
        expect(res.text).toContain('Redirecting to /search')
      })
  })
})
