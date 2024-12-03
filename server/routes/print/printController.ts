import { Request, Response } from 'express'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import AuditService from '../../services/auditService'

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

export default class PrintController {
  constructor(
    private readonly historicalPrisonerService: HistoricalPrisonerService,
    private readonly auditService: AuditService,
  ) {}

  async getDetail(req: Request, res: Response): Promise<void> {
    const { prisonNo } = req.params
    if (prisonNo !== req.session.prisonerDetail?.prisonNumber) {
      // update session if we don't have the correct or any prison details
      req.session.prisonerDetail = await this.historicalPrisonerService.getPrisonerDetail(req.user.token, prisonNo)
    }
    res.render('pages/print', { detail: req.session.prisonerDetail.personalDetails, items: itemsWithAll })
  }
}
