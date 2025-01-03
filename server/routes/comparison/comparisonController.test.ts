import { Request, Response } from 'express'

import DetailController from './comparisonController'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import auditServiceMock from '../../testutils/auditServiceMock'

jest.mock('../../services/historicalPrisonerService')
const historicalPrisonerService = new HistoricalPrisonerService() as jest.Mocked<HistoricalPrisonerService>
const auditService = auditServiceMock()
const controller = new DetailController(historicalPrisonerService, auditService)

describe('Comparison controller', () => {
  let req: Request
  let res: Response

  const prisoner1Detail = { prisonNumber: 'AB12345', summary: { firstName: 'JOHN', lastName: 'SMITH' } }
  const prisoner2Detail = { prisonNumber: 'ZZ54321', summary: { firstName: 'FRED', lastName: 'JAMES' } }
  const prisoner3Detail = { prisonNumber: 'MC98765', summary: { firstName: 'BERT', lastName: 'SCOTT' } }

  beforeEach(() => {
    jest.resetAllMocks()
    req = {
      user: { token: 'token' },
      session: {},
      body: {},
    } as unknown as Request
    res = {
      locals: { user: { username: 'user' } },
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn(),
    } as unknown as Response
  })

  describe('getComparisonDetails', () => {
    it('should retrieve prisoner detail and render the comparison page for multiple prisoners', async () => {
      historicalPrisonerService.getPrisonerDetail
        .mockResolvedValueOnce(prisoner1Detail)
        .mockResolvedValueOnce(prisoner2Detail)
        .mockResolvedValue(prisoner3Detail)

      req.session.shortlist = ['AB12345', 'ZZ54321', 'MC98765']

      await controller.getComparisonDetail(req, res)

      expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'AB12345')
      expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'ZZ54321')
      expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'MC98765')
      expectRenderComparisonContaining3PrisonersDetails()
    })

    it('should retrieve prisoner detail and render the comparison page', async () => {
      historicalPrisonerService.getPrisonerDetail.mockResolvedValue(prisoner1Detail)
      req.session.shortlist = [prisoner1Detail.prisonNumber]

      await controller.getComparisonDetail(req, res)

      expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'AB12345')
      expectRenderComparisonContainingDetail()
      expect(req.session.shortlist).toStrictEqual([prisoner1Detail.prisonNumber])
    })

    it('should audit details viewed', async () => {
      historicalPrisonerService.getPrisonerDetail.mockResolvedValue(prisoner1Detail)
      req.session.shortlist = [prisoner1Detail.prisonNumber]
      req.id = 'COR_ID'

      await controller.getComparisonDetail(req, res)

      expect(auditService.logPageView).toHaveBeenCalledWith('COMPARISON', {
        who: 'user',
        subjectId: 'AB12345',
        correlationId: 'COR_ID',
      })
      expectRenderComparisonContainingDetail()
    })
  })

  function expectRenderComparisonContainingDetail() {
    expect(res.render).toHaveBeenCalledWith(
      'pages/comparison',
      expect.objectContaining({ prisoners: [prisoner1Detail] }),
    )
  }
  function expectRenderComparisonContaining3PrisonersDetails() {
    expect(res.render).toHaveBeenCalledWith(
      'pages/comparison',
      expect.objectContaining({ prisoners: [prisoner1Detail, prisoner2Detail, prisoner3Detail] }),
    )
  }
})
