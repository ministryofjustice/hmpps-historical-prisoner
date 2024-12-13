import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGotenbergPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/gotenberg/health',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'up' : 'down' },
      },
    }),
  stubCreatePdf: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: '/gotenberg/forms/chromium/convert/html',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { response: 'this should really be a blob instead' },
      },
    }),
}
