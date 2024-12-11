import { Request, Response } from 'express'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import AuditService from '../../services/auditService'
import HmppsError from '../../interfaces/HmppsError'
import AbstractDetailController from '../detail/abstractDetailController'
import config from '../../config'

type ItemType = { divider?: string; value?: string; text?: string; behaviour?: string }

const items: ItemType[] = [
  { value: 'summary', text: 'Subject' },
  { value: 'sentenceSummary', text: 'Sentence summary' },
  { value: 'sentencing', text: 'Sentence history' },
  { value: 'courtHearings', text: 'Court hearings' },
  { value: 'movements', text: 'Movements' },
  { value: 'hdc', text: 'HDC history' },
  { value: 'offences', text: 'Offences' },
  { value: 'offencesInCustody', text: 'Offences in custody' },
  { value: 'aliases', text: 'Aliases' },
  { value: 'addresses', text: 'Addresses' },
]
const orAll: ItemType[] = [
  { divider: 'or' },
  { value: 'all', text: 'All, I would like all details', behaviour: 'exclusive' },
]
const itemsWithAll = items.concat(orAll)

type PageData = {
  errors?: HmppsError[]
}

export default class PrintController extends AbstractDetailController {
  constructor(
    historicalPrisonerService: HistoricalPrisonerService,
    private readonly auditService: AuditService,
  ) {
    super(historicalPrisonerService)
  }

  async getPrintForm(req: Request, res: Response): Promise<void> {
    return this.renderView(req, res)
  }

  async postPrintForm(req: Request, res: Response): Promise<void> {
    const { section } = req.body
    if (!section) {
      res.status(400)
      const errors: HmppsError[] = [{ href: '#section', text: 'Please select at least one section to print' }]
      return this.renderView(req, res, { errors })
    }
    const { prisonNo } = req.params
    // TODO: pass the selected sections to the pdf render service
    return res.redirect(`/print/${prisonNo}/pdf`)
  }

  async renderPdf(req: Request, res: Response): Promise<void> {
    const prisonerDetail = await this.getPrisonerDetail(req)
    const { pdfMargins } = config.apis.gotenberg
    res.renderPdf(
      `pages/pdf`,
      { ...prisonerDetail },
      `pages/pdfHeader`,
      { ...prisonerDetail },
      `pages/pdfFooter`,
      {},
      {
        filename: `print-${prisonerDetail.prisonNumber}.pdf`,
        pdfMargins,
      },
    )
  }

  async renderView(req: Request, res: Response, pageData?: PageData): Promise<void> {
    const prisonerDetail = await this.getPrisonerDetail(req)
    res.render('pages/print', { summary: prisonerDetail.summary, items: itemsWithAll, ...pageData })
  }
}
