import Page, { PageElement } from './page'

export default class Suggestions extends Page {
  constructor() {
    super('Suggestions and tips')
  }

  backLink = (): PageElement => cy.get('.govuk-back-link')

  newSearch = (): PageElement => cy.get('[data-qa="clear-search"]')
}