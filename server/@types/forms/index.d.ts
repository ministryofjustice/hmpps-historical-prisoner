declare module 'forms' {
  export interface PrisonerSearchForm {
    searchFormType: string
    firstName?: string
    lastName?: string
    dob?: string
    ageRange?: string
    prisonerNumber?: string
    pncNumber?: string
    croNumber?: string
    other?: string
  }
}
