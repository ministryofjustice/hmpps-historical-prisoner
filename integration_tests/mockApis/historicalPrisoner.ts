import { stubFor } from './wiremock'
import prisonerDetail from './prisonerDetail.json'
import prisonerSearchResults from './prisonerSearchResults.json'

const ping = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/historical-prisoner-api/health/ping',
    },
    response: {
      status: 200,
    },
  })

const stubPrisonerSearchByName = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/historical-prisoner-api/search.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: prisonerSearchResults,
    },
  })

const stubPrisonerSearchByIdentifiers = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/historical-prisoner-api/identifiers.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: prisonerSearchResults,
    },
  })

const stubPrisonerSearchByAddress = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/historical-prisoner-api/address-lookup.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: prisonerSearchResults,
    },
  })

const stubPrisonerDetail = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/historical-prisoner-api/detail/.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: prisonerDetail,
    },
  })

export default {
  stubHistoricalPrisonerPing: ping,
  stubPrisonerSearchByName,
  stubPrisonerSearchByIdentifiers,
  stubPrisonerSearchByAddress,
  stubPrisonerDetail,
}
