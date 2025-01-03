import { Request, Response } from 'express'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import AuditService, { Page } from '../../services/auditService'
import AbstractComparisonController from './abstractComparisonController'
import { PrisonerDetailDto } from '../../@types/historical-prisoner/historicalPrisonerApiTypes'
import logger from '../../../logger'

export default class ComparisonController extends AbstractComparisonController {
  constructor(
    historicalPrisonerService: HistoricalPrisonerService,
    private readonly auditService: AuditService,
  ) {
    super(historicalPrisonerService)
  }

  async getComparisonDetail(req: Request, res: Response): Promise<void> {
    logger.debug('GET /comparison')
    const prisoners: PrisonerDetailDto[] = await this.getPrisonerDetail(req)
    await this.auditService.logPageView(Page.COMPARISON, {
      who: res.locals.user.username,
      subjectId: prisoners.map(({ prisonNumber }) => prisonNumber).join(','),
      correlationId: req.id,
    })
    res.render('pages/comparison', { prisoners })
  }
}
