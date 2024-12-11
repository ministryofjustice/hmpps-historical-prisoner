import { HmppsUser } from '../../interfaces/hmppsUser'

export declare module 'express-session' {
  export interface PrisonerSearchForm {
    searchType: string
    firstName?: string
    lastName?: string
    dobDay?: string
    dobMonth?: string
    dobYear?: string
    age?: string

    prisonNumber?: string
    pncNumber?: string
    croNumber?: string

    address?: string

    female?: string
    male?: string
    gender?: string
    hdc?: boolean
    lifer?: boolean
  }

  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    disclaimerConfirmed: boolean
    prisonerSearchForm: PrisonerSearchForm
    searchParams: SearchParams
    prisonerDetail: PrisonerDetailDto
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }

    interface Locals {
      user: HmppsUser
    }
  }
}
type SearchParams = Partial<{
  filters: string[] | null
  page: number
}>
