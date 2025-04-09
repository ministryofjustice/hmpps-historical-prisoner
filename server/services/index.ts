import { dataAccess } from '../data'
import AuditService from './auditService'
import HistoricalPrisonerService from './historicalPrisonerService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, historicalPrisonerApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    historicalPrisonerService: new HistoricalPrisonerService(historicalPrisonerApiClient),
  }
}

export type Services = ReturnType<typeof services>
