import Page, { PageElement } from './page'

export default class Disclaimer extends Page {
  constructor() {
    super('Usage')
  }

  disclaimerCheckbox = cy.contains('label', 'I confirm that I understand').prev()

  errorSummaryList = (): PageElement => cy.get('[data-module="govuk-error-summary"]')

  confirmButton = (): PageElement => cy.get('button[type="submit"]')

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')
}
