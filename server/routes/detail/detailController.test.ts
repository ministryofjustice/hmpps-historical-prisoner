import { Request, Response } from 'express'

import DetailController from './detailController'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import auditServiceMock from '../../testutils/auditServiceMock'

jest.mock('../../services/historicalPrisonerService')
const historicalPrisonerService = new HistoricalPrisonerService() as jest.Mocked<HistoricalPrisonerService>
const auditService = auditServiceMock()

describe('Detail controller', () => {
  let req: Request
  let res: Response
  let controller: DetailController

  const detail = { prisonNumber: 'AB12345', personalDetails: { firstName: 'JOHN', lastName: 'SMITH' } }

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      query: { page: '0', sort: 'dateCreated,ASC', alertType: 'R', from: '01/01/2023', to: '02/02/2023' },
      path: 'alerts/active',
      user: { token: 'token', username: 'user', authSource: 'nomis' },
      session: {},
      body: {},
    } as unknown as Request
    res = {
      locals: {
        user: {
          authSource: 'nomis',
          userRoles: [],
          token: 'TOKEN',
          username: 'user',
          userId: '12345',
          name: 'Billy Bob',
          displayName: 'Billy Bob',
        },
      },
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn(),
    } as unknown as Response
    controller = new DetailController(historicalPrisonerService, auditService)
  })

  describe('getDetail', () => {
    it('should retrieve prisoner detail and render the detail page if no session object', async () => {
      historicalPrisonerService.getPrisonerDetail.mockResolvedValue(detail)

      await controller.getDetail(
        { ...req, params: { prisonNo: 'AB12345' } } as unknown as Request,
        { ...res } as Response,
      )

      expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'AB12345')
      expectDetailContainingDetail()
    })
    it('should retrieve prisoner detail and render the detail page if session object contains different prisoner', async () => {
      historicalPrisonerService.getPrisonerDetail.mockResolvedValue(detail)

      await controller.getDetail(
        { ...req, params: { prisonNo: 'BC12345' }, session: { prisonerDetail: detail } } as unknown as Request,
        { ...res } as Response,
      )

      expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'BC12345')
      expectDetailContainingDetail()
    })

    it('should just render the detail page if session object exists', async () => {
      await controller.getDetail(
        { ...req, params: { prisonNo: 'AB12345' }, session: { prisonerDetail: detail } } as unknown as Request,
        { ...res } as Response,
      )

      expect(historicalPrisonerService.getPrisonerDetail).not.toHaveBeenCalled()
      expectDetailContainingDetail()
    })

    it('should audit details viewed', async () => {
      await controller.getDetail(
        {
          ...req,
          params: { prisonNo: 'AB12345' },
          session: { prisonerDetail: detail },
          id: 'COR_ID',
        } as unknown as Request,
        { ...res } as Response,
      )

      expect(auditService.logPageView).toHaveBeenCalledWith('DETAIL', {
        who: 'user',
        subjectId: 'AB12345',
        correlationId: 'COR_ID',
      })
      expectDetailContainingDetail()
    })
  })

  function expectDetailContainingDetail() {
    expect(res.render).toHaveBeenCalledWith('pages/detail', expect.objectContaining({ detail }))
  }
})
