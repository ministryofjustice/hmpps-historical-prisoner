export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  static verifyOnPageWithTitleParam<T>(constructor: new (param1) => T, param: string): T {
    return new constructor(param)
  }

  protected constructor(private readonly title: string) {
    this.checkOnPage()
  }

  checkOnPage(): void {
    cy.get('h1').contains(this.title)
  }

  manageDetails = (): PageElement => cy.get('[data-qa=manageDetails]')

  signOutLink = (): PageElement => cy.get('[data-qa=signOut]')

  headerUserName = (): PageElement => cy.get('[data-qa="header-user-name"]')

  headerPhaseBanner = (): PageElement => cy.get('.govuk-phase-banner')

  activeLocation = (): PageElement => cy.get('[data-qa="header-active-case-load"]')

  manageAccountLink = (): PageElement => cy.get('[data-test="manage-account-link"]')

  changeLocationLink = (): PageElement => cy.get('[data-qa="changeCaseLoad"]')

  errorSummaryList = (): PageElement => cy.get('[data-module="govuk-error-summary"]')
}
