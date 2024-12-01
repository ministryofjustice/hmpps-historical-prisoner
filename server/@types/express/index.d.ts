import { HmppsUser } from '../../interfaces/hmppsUser'

export declare module 'express-session' {
  export interface PrisonerSearchForm {
    searchType: string
    firstName?: string
    lastName?: string
    dob: string
    ageRange?: string

    prisonNumber?: string
    pncNumber?: string
    croNumber?: string

    address?: string

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
