import Page, { PageElement } from './page'

export default class Suggestions extends Page {
  constructor() {
    super('Suggestions and tips')
  }

  backLink = (): PageElement => cy.get('.govuk-back-link')

  newSearch = (): PageElement => cy.get('[data-qa="clear-search"]')

  useInitial = (): PageElement => cy.get('[data-qa="use-initial"]')

  forenameWildcard = (): PageElement => cy.get('[data-qa="forename-wildcard"]')

  surnameWildcard = (): PageElement => cy.get('[data-qa="surname-wildcard"]')

  surnameShorterWildcard = (): PageElement => cy.get('[data-qa="surname-shorterwildcard"]')
}
