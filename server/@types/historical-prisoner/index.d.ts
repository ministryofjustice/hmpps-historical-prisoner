/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/search': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Retrieve prisoners from search terms
     * @description Requires role ROLE_HPA_USER
     */
    get: operations['findPrisoners']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/identifiers': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Retrieve prisoners from identifier search terms
     * @description Requires role ROLE_HPA_USER
     */
    get: operations['findPrisonersWithIdentifiers']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/detail/{prisonNumber}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Retrieve individual prisoner details
     * @description Requires role ROLE_HPA_USER
     */
    get: operations['getDetail']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/address-lookup': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Retrieve prisoners from address terms
     * @description Requires role ROLE_HPA_USER
     */
    get: operations['findPrisonersWithAddresses']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    ErrorResponse: {
      /** Format: int32 */
      status: number
      errorCode?: string
      userMessage?: string
      developerMessage?: string
      moreInfo?: string
    }
    Pageable: {
      /** Format: int32 */
      page?: number
      /** Format: int32 */
      size?: number
      sort?: string[]
    }
    PageMetadata: {
      /** Format: int64 */
      size?: number
      /** Format: int64 */
      number?: number
      /** Format: int64 */
      totalElements?: number
      /** Format: int64 */
      totalPages?: number
    }
    PagedModelPrisonerSearchDto: {
      content?: components['schemas']['PrisonerSearchDto'][]
      page?: components['schemas']['PageMetadata']
    }
    PrisonerSearchDto: {
      prisonNumber: string
      /** Format: date */
      receptionDate?: string
      lastName?: string
      firstName?: string
      middleName?: string
      /** Format: date */
      dob?: string
      isAlias: boolean
      aliasLast?: string
      aliasFirst?: string
      aliasMiddle?: string
      /** Format: date */
      aliasDob?: string
    }
    AddressesDto: {
      type?: string
      person?: string
      street?: string
      town?: string
      county?: string
      /** Format: int32 */
      sequence?: number
    }
    AliasesDto: {
      last?: string
      first?: string
      middle?: string
      /** Format: date */
      birthDate?: string
    }
    CategoryDto: {
      /** Format: date */
      date?: string
      category?: string
    }
    CourtHearingsDto: {
      /** Format: date */
      date?: string
      court?: string
    }
    HdcInfoDto: {
      stage?: string
      status?: string
      /** Format: date */
      date?: string
      reasons?: string
    }
    HdcRecallDto: {
      /** Format: date */
      createdDate?: string
      /** Format: date */
      curfewEndDate?: string
      /** Format: date */
      outcomeDate?: string
      outcome?: string
      reason?: string
    }
    MovementsDto: {
      /** Format: date */
      date?: string
      establishment?: string
      type?: string
      movement?: string
    }
    OffencesDto: {
      /** Format: date */
      date?: string
      /** Format: int32 */
      code?: number
      establishment?: string
    }
    OffencesInCustodyDto: {
      /** Format: date */
      date?: string
      outcome?: string
      charge?: string
      establishment?: string
      punishments?: components['schemas']['PunishmentDto'][]
    }
    PersonalDetailsDto: {
      prisonNumber?: string
      pncNumber?: string
      croNumber?: string
      paroleNumbers?: string
      initial?: string
      firstName?: string
      middleName?: string
      lastName?: string
      sex?: string
      /** Format: date */
      dob?: string
      ethnicity?: string
      birthCountry?: string
      nationality?: string
      religion?: string
      /** Format: date */
      receptionDate?: string
      maritalStatus?: string
    }
    PrisonerDetailDto: {
      prisonNumber?: string
      summary: components['schemas']['PersonalDetailsDto']
      addresses?: components['schemas']['AddressesDto'][]
      aliases?: components['schemas']['AliasesDto'][]
      courtHearings?: components['schemas']['CourtHearingsDto'][]
      hdcInfo?: components['schemas']['HdcInfoDto'][]
      hdcRecall?: components['schemas']['HdcRecallDto'][]
      movements?: components['schemas']['MovementsDto'][]
      offences?: components['schemas']['OffencesDto'][]
      offencesInCustody?: components['schemas']['OffencesInCustodyDto'][]
      sentencing?: components['schemas']['SentencingDto'][]
      sentenceSummary?: components['schemas']['SentenceSummaryDto']
    }
    PunishmentDto: {
      punishment?: string
      /** Format: int32 */
      duration?: number
    }
    SentenceSummaryDto: {
      category?: components['schemas']['CategoryDto']
      establishment?: string
      courtHearing?: components['schemas']['CourtHearingsDto']
      effectiveSentence?: components['schemas']['SentencingDto']
    }
    SentencingDto: {
      /** Format: int32 */
      lengthDays?: number
      /** Format: date */
      changeDate?: string
      /** Format: date */
      SED?: string
      /** Format: date */
      PED?: string
      /** Format: date */
      NPD?: string
      /** Format: date */
      LED?: string
      /** Format: date */
      CRD?: string
      /** Format: date */
      HDCAD?: string
      /** Format: date */
      HDCED?: string
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  findPrisoners: {
    parameters: {
      query: {
        /** @description Forename to search for. Wildcards (% or *) can be used. A single initial will automatically be wildcarded. */
        forename?: string
        /** @description Surname to search for. Wildcards (% or *) can be used. */
        surname?: string
        /** @description Date of birth to search for */
        dateOfBirth?: string
        /** @description Age from which to search for.  If no ageTo is provided then ageFrom is used as ageTo as well. */
        ageFrom?: number
        /** @description Age to which to search for.  Must be used in combination with ageFrom. */
        ageTo?: number
        /** @description Gender to search for, either M or F. Must be used in combination with forename, surname, dateOfBirth or ageFrom. */
        gender?: string
        /** @description Whether the prisoner has a HDC. Must be used in combination with forename, surname, dateOfBirth or ageFrom. */
        hdc?: boolean
        /** @description Whether the prisoner is a lifer. Must be used in combination with forename, surname, dateOfBirth or ageFrom. */
        lifer?: boolean
        pageRequest: components['schemas']['Pageable']
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description list of prisoner numbers */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['PagedModelPrisonerSearchDto']
        }
      }
      /** @description Unauthorized to access this endpoint */
      401: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Forbidden to access this endpoint */
      403: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  findPrisonersWithIdentifiers: {
    parameters: {
      query: {
        prisonNumber?: string
        pnc?: string
        cro?: string
        /** @description Gender to search for, either M or F. Must be used in combination with prisonNumber, pnc or cro. */
        gender?: string
        /** @description Whether the prisoner has a HDC. Must be used in combination with prisonNumber, pnc or cro. */
        hdc?: boolean
        /** @description Whether the prisoner is a lifer. Must be used in combination with prisonNumber, pnc or cro. */
        lifer?: boolean
        pageRequest: components['schemas']['Pageable']
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description list of prisoner numbers */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['PagedModelPrisonerSearchDto']
        }
      }
      /** @description Unauthorized to access this endpoint */
      401: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Forbidden to access this endpoint */
      403: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  getDetail: {
    parameters: {
      query?: never
      header?: never
      path: {
        prisonNumber: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Prisoner detail */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['PrisonerDetailDto']
        }
      }
      /** @description Unauthorized to access this endpoint */
      401: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Forbidden to access this endpoint */
      403: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Prisoner not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  findPrisonersWithAddresses: {
    parameters: {
      query: {
        /** @description Address terms to search for */
        addressTerms: string
        /** @description Gender to search for, either M or F. Must be used in combination with addressTerms. */
        gender?: string
        /** @description Whether the prisoner has a HDC. Must be used in combination with addressTerms. */
        hdc?: boolean
        /** @description Whether the prisoner is a lifer. Must be used in combination with addressTerms. */
        lifer?: boolean
        pageRequest: components['schemas']['Pageable']
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description list of prisoner numbers */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['PagedModelPrisonerSearchDto']
        }
      }
      /** @description Unauthorized to access this endpoint */
      401: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
      /** @description Forbidden to access this endpoint */
      403: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
}
