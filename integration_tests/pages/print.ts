import Page, { PageElement } from './page'

export default class Print extends Page {
  constructor(name: string) {
    super(`Which details would you like to save for ${name}?`)
  }

  optionCheckbox = text => cy.contains('label', text).prev()

  saveButton = (): PageElement => cy.get('button[type="submit"]')

  backLink = (): PageElement => cy.get('.govuk-back-link')
}
