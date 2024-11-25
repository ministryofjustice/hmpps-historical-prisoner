import HistoricalPrisonerApiClient from '../../data/historicalPrisonerApiClient'

export default class SearchController {
  constructor(private readonly historicalPrisonerSearchApiClient: HistoricalPrisonerApiClient) {}

  async startNewPrisonerSearch(req: Request, res: Response): Promise<void> {
    await this.startNewPrisonerSearch(req, res)
  }
}
