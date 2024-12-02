import Page, { PageElement } from './page'

export default class Search extends Page {
  constructor() {
    super('Prisoner Search')
  }

  searchSelectRadioButton = text => cy.contains('label', text).prev()

  searchButton = (): PageElement => cy.get('button[type="submit"]')

  firstName = (): PageElement => cy.get('[id="firstName"]')

  lastName = (): PageElement => cy.get('[id="lastName"]')

  searchResults = (): PageElement => cy.get('[data-qa="search-results"] tbody tr ')
}
