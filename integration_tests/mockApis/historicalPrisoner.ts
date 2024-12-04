import { stubFor } from './wiremock'
import prisonerDetail from './prisonerDetail.json'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prisonerSearchResultsWithLocation = {
  content: [
    {
      prisonerNumber: 'A1234AA',
      pncNumber: '12/1234AA',
      croNumber: '1234AA',
      firstName: 'John',
      middleNames: 'James',
      lastName: 'Smith',
      dateOfBirth: '1980-01-01',
      currentLocation: { agencyId: 'MDI', description: 'HMP Moorland' },
      status: 'ACTIVE',
      bookingId: 12345,
    },
    {
      prisonerNumber: 'A1234AB',
      pncNumber: '12/1234AB',
      croNumber: '1234AB',
      firstName: 'Jane',
      middleNames: 'Jill',
      lastName: 'Smith',
      dateOfBirth: '1980-01-01',
      currentLocation: { agencyId: 'MDI', description: 'HMP Moorland' },
      status: 'ACTIVE',
      bookingId: 12346,
    },
    {
      prisonerNumber: 'A1234AC',
      pncNumber: '12/1234AC',
      croNumber: '1234AC',
      firstName: 'Jim',
      middleNames: 'John',
      lastName: 'Smith',
      dateOfBirth: '1980-01-01',
      currentLocation: { agencyId: 'MDI', description: 'HMP Moorland' },
      status: 'ACTIVE',
      bookingId: 12347,
    },
  ],
  page: {
    size: 20,
    number: 1,
    totalElements: 2,
    totalPages: 1,
  },
}

const prisonerSearchResults = {
  content: [
    {
      prisonNumber: 'BF123455',
      lastName: 'WILSON',
      firstName: 'GOLDIE',
      middleName: '',
      isAlias: false,
      receptionDate: '1955-11-12',
      aliasLast: 'WILSON',
      aliasFirst: 'GOLDIE',
      aliasMiddle: '',
      dob: '1967-01-05',
    },
    {
      prisonNumber: 'BF123455',
      lastName: 'WILSON',
      firstName: 'MAYOR',
      middleName: '',
      isAlias: true,
      receptionDate: '1955-11-12',
      aliasLast: 'WILSON',
      aliasFirst: 'GOLDIE',
      aliasMiddle: '',
      dob: '1967-01-05',
    },
  ],
  page: {
    size: 20,
    number: 0,
    totalElements: 2,
    totalPages: 1,
  },
}

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
