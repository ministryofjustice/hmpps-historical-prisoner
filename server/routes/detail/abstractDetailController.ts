import { Request } from 'express'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'

export default abstract class AbstractDetailController {
  protected constructor(protected readonly historicalPrisonerService: HistoricalPrisonerService) {}

  protected async getPrisonerDetail(req: Request) {
    const { prisonNo } = req.params
    if (prisonNo !== req.session.prisonerDetail?.prisonNumber) {
      // update session if we don't have the correct or any prison details
      req.session.prisonerDetail = await this.historicalPrisonerService.getPrisonerDetail(req.user.token, prisonNo)
    }
    return req.session.prisonerDetail
  }
}
