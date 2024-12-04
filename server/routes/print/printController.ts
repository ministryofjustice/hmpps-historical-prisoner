import { Request, Response } from 'express'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import AuditService from '../../services/auditService'
import HmppsError from '../../interfaces/HmppsError'

type ItemType = { divider?: string; value?: string; text?: string; behaviour?: string }

const items: ItemType[] = [
  { value: 'summary', text: 'Subject' },
  { value: 'sentenceSummary', text: 'Sentence' },
  { value: 'sentencing', text: 'Sentence' },
  { value: 'courtHearings', text: 'Court' },
  { value: 'movements', text: 'Movements' },
  { value: 'hdc', text: 'HDC' },
  { value: 'offences', text: 'Offences' },
  { value: 'offencesInCustody', text: 'Offences' },
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

export default class PrintController {
  constructor(
    private readonly historicalPrisonerService: HistoricalPrisonerService,
    private readonly auditService: AuditService,
  ) {}

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
    // TODO: display PDF
    return res.redirect(`/detail/${prisonNo}`)
  }

  async renderView(req: Request, res: Response, pageData?: PageData): Promise<void> {
    const { prisonNo } = req.params
    if (prisonNo !== req.session.prisonerDetail?.prisonNumber) {
      // update session if we don't have the correct or any prison details
      req.session.prisonerDetail = await this.historicalPrisonerService.getPrisonerDetail(req.user.token, prisonNo)
    }
    res.render('pages/print', { detail: req.session.prisonerDetail.personalDetails, items: itemsWithAll, ...pageData })
  }
}
