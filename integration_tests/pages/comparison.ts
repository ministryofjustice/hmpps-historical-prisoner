import Page, { PageElement } from './page'

export default class Comparison extends Page {
  constructor() {
    super('Prisoner comparison')
  }

  detailLink = (index: number): PageElement => cy.get(`[data-qa="name${index}"]`)

  removeFromShortlist = (index: number): PageElement => cy.get(`[data-qa="remove-link${index}"]`)

  backLink = (): PageElement => cy.get('.govuk-back-link')
}
