import { Request, Response } from 'express'

import PrintController from './printController'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import auditServiceMock from '../../testutils/auditServiceMock'
import config from '../../config'

jest.mock('../../services/historicalPrisonerService')
const historicalPrisonerService = new HistoricalPrisonerService() as jest.Mocked<HistoricalPrisonerService>
const controller = new PrintController(historicalPrisonerService, auditServiceMock())

describe('Print controller', () => {
  let req: Request
  let res: Response

  const detail = { prisonNumber: 'AB12345', summary: { firstName: 'JOHN', lastName: 'SMITH' } }

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
      renderPdf: jest.fn(),
    } as unknown as Response
  })

  describe('getPrintForm', () => {
    it('should retrieve prisoner detail and render the print page if no session object', async () => {
      historicalPrisonerService.getPrisonerDetail.mockResolvedValue(detail)
      req.params = { prisonNo: 'AB12345' }

      await controller.getPrintForm(req, res)

      expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'AB12345')
      expectRenderPrintContainingDetail()
      expect(req.session.prisonerDetail).toBe(detail)
    })

    it('should retrieve prisoner detail and render the print page if session object contains different prisoner', async () => {
      historicalPrisonerService.getPrisonerDetail.mockResolvedValue(detail)
      req.params = { prisonNo: 'BC12345' }
      req.session.prisonerDetail = detail

      await controller.getPrintForm(req, res)

      expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'BC12345')
      expectRenderPrintContainingDetail()
      expect(req.session.prisonerDetail).toBe(detail)
    })

    it('should just render the print page if session object exists', async () => {
      req.params = { prisonNo: 'AB12345' }
      req.session.prisonerDetail = detail

      await controller.getPrintForm(req, res)

      expect(historicalPrisonerService.getPrisonerDetail).not.toHaveBeenCalled()
      expectRenderPrintContainingDetail()
    })

    it('should render the print page with items including all and or', async () => {
      req.params = { prisonNo: 'AB12345' }
      req.session.prisonerDetail = detail

      await controller.getPrintForm(req, res)

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
        req.params = { prisonNo: 'AB12345' }

        await controller.postPrintForm(req, res)

        expect(historicalPrisonerService.getPrisonerDetail).toHaveBeenCalledWith('token', 'AB12345')
        expectRenderPrintContainingDetail()
      })

      it('should render error messages on the print page', async () => {
        req.params = { prisonNo: 'AB12345' }
        req.session.prisonerDetail = detail

        await controller.postPrintForm(req, res)

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
        req.params = { prisonNo: 'AB12345' }
        req.body.section = 'summary'

        await controller.postPrintForm(req, res)

        expect(res.redirect).toHaveBeenCalledWith('/print/AB12345/pdf')
      })
    })
  })

  describe('renderPdf', () => {
    it('should render PDF with correct parameters', async () => {
      historicalPrisonerService.getPrisonerDetail.mockResolvedValue(detail)
      req.params = { prisonNo: 'AB12345' }

      await controller.renderPdf(req, res)

      expect(res.renderPdf).toHaveBeenCalledWith(
        'pages/pdf',
        { ...detail },
        'pages/pdfHeader',
        { ...detail },
        'pages/pdfFooter',
        {},
        {
          filename: 'print-AB12345.pdf',
          pdfMargins: config.apis.gotenberg.pdfMargins,
        },
      )
    })
  })

  function expectRenderPrintContainingDetail() {
    expect(res.render).toHaveBeenCalledWith('pages/print', expect.objectContaining({ summary: detail.summary }))
  }
})
