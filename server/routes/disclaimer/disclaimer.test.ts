import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import AuditService, { Page } from '../../services/auditService'

jest.mock('../../services/auditService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /disclaimer', () => {
  it('should render index/disclaimer page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/disclaimer')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Usage')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.LOG_IN, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})
