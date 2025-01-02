import Page, { PageElement } from './page'

export default class Search extends Page {
  constructor() {
    super('Prisoner search')
  }

  searchSelectRadioButton = text => cy.contains('label', text).prev()

  firstName = (): PageElement => cy.get('#firstName')

  lastName = (): PageElement => cy.get('#lastName')

  dobDay = (): PageElement => cy.get('#dobDay')

  dobMonth = (): PageElement => cy.get('#dobMonth')

  dobYear = (): PageElement => cy.get('#dobYear')

  age = (): PageElement => cy.get('#age')

  prisonNumber = (): PageElement => cy.get('#prisonNumber')

  pncNumber = (): PageElement => cy.get('#pncNumber')

  croNumber = (): PageElement => cy.get('#croNumber')

  address = (): PageElement => cy.get('#address')

  searchButton = (): PageElement => cy.get('button[type="submit"]')

  doSearch = (): PageElement => {
    return this.searchButton().click()
  }

  maleFilter = (): PageElement => cy.contains('.moj-filter__tag', 'Male')

  femaleFilter = (): PageElement => cy.contains('.moj-filter__tag', 'Female')

  hdcFilter = (): PageElement => cy.contains('.moj-filter__tag', 'HDC')

  liferFilter = (): PageElement => cy.contains('.moj-filter__tag', 'Lifer')

  filterButton = (text: string) => cy.contains('label', text).prev()

  newSearch = (): PageElement => cy.get('[data-qa="clear-search"]')

  suggestions = (): PageElement => cy.get('[data-qa="suggestions"]')

  searchResults = (): PageElement => cy.get('[data-qa="search-results"] tbody tr ')

  searchResultsCount = (): PageElement => cy.get('[data-qa="search-results-count"] ')

  getPaginationResults = (): PageElement => cy.get('.moj-pagination__results')

  nextPage = (): PageElement => cy.get('.moj-pagination__item--next').first().click()

  previousPage = (): PageElement => cy.get('.moj-pagination__item--prev').first().click()

  paginationLink = (pageNumber): PageElement => cy.get('a').contains(pageNumber).first()

  shortlistForm = (prisonNumber: string): PageElement => cy.get(`[data-qa="shortlist-${prisonNumber}"]`)
}
