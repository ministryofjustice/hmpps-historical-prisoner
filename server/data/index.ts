/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import HistoricalPrisonerApiClient from './historicalPrisonerApiClient'

export const dataAccess = () => ({
  applicationInfo,
  hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  historicalPrisonerApiClient: new HistoricalPrisonerApiClient(),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuditClient }
