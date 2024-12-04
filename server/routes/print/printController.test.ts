import { Request, Response } from 'express'

import PrintController from './printController'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import auditServiceMock from '../../testutils/auditServiceMock'

jest.mock('../../services/historicalPrisonerService')
const historicalPrisonerService = new HistoricalPrisonerService() as jest.Mocked<HistoricalPrisonerService>

describe('Print controller', () => {
  let req: Request
  let res: Response
  let controller: PrintController

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
    controller = new PrintController(historicalPrisonerService, auditServiceMock())
  })

  describe('getPrintForm', () => {
    it('should retrieve prisoner detail and render the print page if no session object', async () => {
      historicalPrisonerService.getPrisonerDetail.mockResolvedValue(detail)

      await controller.getPrintForm(
        { ...req, params: { prisonNo: 'AB12345' } } as unknown as Request,
        { ...res } as Response,
      )

      expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'AB12345')
      expectPrintContainingDetail()
    })
    it('should retrieve prisoner detail and render the print page if session object contains different prisoner', async () => {
      historicalPrisonerService.getPrisonerDetail.mockResolvedValue(detail)

      await controller.getPrintForm(
        { ...req, params: { prisonNo: 'BC12345' }, session: { prisonerDetail: detail } } as unknown as Request,
        { ...res } as Response,
      )

      expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'BC12345')
      expectPrintContainingDetail()
    })

    it('should just render the print page if session object exists', async () => {
      await controller.getPrintForm(
        { ...req, params: { prisonNo: 'AB12345' }, session: { prisonerDetail: detail } } as unknown as Request,
        { ...res } as Response,
      )

      expect(historicalPrisonerService.getPrisonerDetail).not.toHaveBeenCalled()
      expectPrintContainingDetail()
    })
    it('should render the print page with items including all and or', async () => {
      await controller.getPrintForm(
        { ...req, params: { prisonNo: 'AB12345' }, session: { prisonerDetail: detail } } as unknown as Request,
        { ...res } as Response,
      )

      expect(historicalPrisonerService.getPrisonerDetail).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(
        'pages/print',
        expect.objectContaining({
          items: expect.arrayContaining([
            { value: 'summary', text: 'Subject' },
            { divider: 'or' },
            { value: 'all', text: 'All, I would like all details', behaviour: 'exclusive' },
          ]),
        }),
      )
    })
  })
  describe('postPrintForm', () => {
    describe('validation', () => {
      it('should retrieve prisoner detail and render the print page if no section passed through', async () => {
        historicalPrisonerService.getPrisonerDetail.mockResolvedValue(detail)

        await controller.postPrintForm(
          { ...req, params: { prisonNo: 'AB12345' } } as unknown as Request,
          { ...res } as Response,
        )

        expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'AB12345')
        expectPrintContainingDetail()
      })

      it('should render error messages on the print page', async () => {
        await controller.postPrintForm(
          { ...req, params: { prisonNo: 'AB12345' }, session: { prisonerDetail: detail } } as unknown as Request,
          { ...res } as Response,
        )

        expect(historicalPrisonerService.getPrisonerDetail).not.toHaveBeenCalled()
        expect(res.render).toHaveBeenCalledWith(
          'pages/print',
          expect.objectContaining({
            errors: [{ href: '#section', text: 'Please select at least one section to print' }],
          }),
        )
        expect(res.status).toHaveBeenCalledWith(400)
      })
    })
    describe('success', () => {
      it('should redirect to detail page', async () => {
        await controller.postPrintForm(
          { ...req, params: { prisonNo: 'AB12345' }, body: { section: 'summary' } } as unknown as Request,
          { ...res } as Response,
        )
        expect(res.redirect).toHaveBeenCalledWith('/detail/AB12345')
      })
    })
  })

  function expectPrintContainingDetail() {
    expect(res.render).toHaveBeenCalledWith('pages/print', expect.objectContaining({ detail: detail.personalDetails }))
  }
})
