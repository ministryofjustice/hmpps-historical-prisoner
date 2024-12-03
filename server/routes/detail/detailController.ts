import { Request, Response } from 'express'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import AuditService from '../../services/auditService'

export default class DetailController {
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
    res.render('pages/detail', { detail: req.session.prisonerDetail })
  }
}
