import Page, { PageElement } from './page'

export default class Search extends Page {
  constructor() {
    super('Prisoner search')
  }

  searchSelectRadioButton = text => cy.contains('label', text).prev()

  firstName = (): PageElement => cy.get('[id="firstName"]')

  lastName = (): PageElement => cy.get('[id="lastName"]')

  dobDay = (): PageElement => cy.get('[id="dobDay"]')

  dobMonth = (): PageElement => cy.get('[id="dobMonth"]')

  dobYear = (): PageElement => cy.get('[id="dobYear"]')

  age = (): PageElement => cy.get('[id="age"]')

  prisonNumber = (): PageElement => cy.get('[id="prisonNumber"]')

  pncNumber = (): PageElement => cy.get('[id="pncNumber"]')

  croNumber = (): PageElement => cy.get('[id="croNumber"]')

  address = (): PageElement => cy.get('[id="address"]')

  searchButton = (): PageElement => cy.get('button[type="submit"]')

  doSearch = (): PageElement => {
    return this.searchButton().click()
  }

  newSearch = (): PageElement => cy.get('[data-qa="clear-search"]')

  suggestions = (): PageElement => cy.get('[data-qa="suggestions"]')

  searchResults = (): PageElement => cy.get('[data-qa="search-results"] tbody tr ')

  searchResultsCount = (): PageElement => cy.get('[data-qa="search-results-count"] ')

  getPaginationResults = (): PageElement => cy.get('.moj-pagination__results')

  errorBlock = (): PageElement => cy.get('.govuk-error-summary')

  nextPage = (): PageElement => cy.get('.moj-pagination__item--next').first().click()

  previousPage = (): PageElement => cy.get('.moj-pagination__item--prev').first().click()

  paginationLink = (pageNumber): PageElement => cy.get('a').contains(pageNumber).first()
}
