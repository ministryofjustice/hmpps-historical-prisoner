import { Request } from 'express'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import { PrisonerDetailDto } from '../../@types/historical-prisoner/historicalPrisonerApiTypes'

export default abstract class AbstractComparisonController {
  protected constructor(protected readonly historicalPrisonerService: HistoricalPrisonerService) {}

  protected async getPrisonerDetail(req: Request): Promise<PrisonerDetailDto[]> {
    const { shortlist } = req.session
    const results: PrisonerDetailDto[] = []

    if (shortlist) {
      const promises = shortlist.map(prisonerNo =>
        this.historicalPrisonerService.getPrisonerDetail(req.user.token, prisonerNo),
      )
      results.push(...(await Promise.all(promises)))
    }
    return results
  }
}
