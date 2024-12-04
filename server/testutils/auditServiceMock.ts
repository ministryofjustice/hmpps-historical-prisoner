import AuditService from '../services/auditService'

const auditServiceMock = (): AuditService =>
  ({
    logAuditEvent: jest.fn().mockImplementation(() => Promise.resolve()),
    logPageView: jest.fn().mockImplementation(() => Promise.resolve()),
  }) as unknown as AuditService

export default auditServiceMock
