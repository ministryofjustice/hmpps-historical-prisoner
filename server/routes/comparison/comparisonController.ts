import { Request, Response } from 'express'
import HistoricalPrisonerService from '../../services/historicalPrisonerService'
import AuditService, { Page } from '../../services/auditService'
import { PrisonerDetailDto } from '../../@types/historical-prisoner/historicalPrisonerApiTypes'
import logger from '../../../logger'

export default class ComparisonController {
  constructor(
    private readonly historicalPrisonerService: HistoricalPrisonerService,
    private readonly auditService: AuditService,
  ) {}

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

  async getPrisonerDetail(req: Request): Promise<PrisonerDetailDto[]> {
    const { shortlist } = req.session
    const results = []

    if (shortlist && shortlist.length <= 3) {
      const promises = shortlist.map(prisonerNo =>
        this.historicalPrisonerService.getPrisonerDetail(req.user.token, prisonerNo),
      )
      results.push(...(await Promise.all(promises)))
    }
    return results
  }

  addToShortlist(req: Request, res: Response) {
    if (req.body.view) return res.redirect('/comparison')

    req.session.shortlist ??= []
    if (req.body.add) {
      // already max items in shortlist - no more can be added
      if (req.session.shortlist.length < 3) {
        req.session.shortlist.push(req.body.prisoner)
      } else {
        // TODO: Need to add in MoJ basnner too for error
      }
    } else {
      req.session.shortlist = req.session.shortlist.filter(item => item !== req.body.prisoner)
    }
    // TODO: Need to add in MoJ banner too for success
    return res.redirect('/search/results')
  }
}
