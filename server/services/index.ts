import { dataAccess } from '../data'
import AuditService from './auditService'
import HistoricalPrisonerService from './historicalPrisonerService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, historicalPrisonerApiClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)

  return {
    applicationInfo,
    auditService,
    historicalPrisonerService: new HistoricalPrisonerService(historicalPrisonerApiClient),
  }
}

export type Services = ReturnType<typeof services>
