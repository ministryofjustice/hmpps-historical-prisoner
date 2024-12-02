import { dataAccess } from '../data'
import AuditService from './auditService'
import HistoricalPrisonerService from './historicalPrisonerService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const historicalPrisonerService = new HistoricalPrisonerService()

  return {
    applicationInfo,
    auditService,
    historicalPrisonerService,
  }
}

export type Services = ReturnType<typeof services>
