import Page, { PageElement } from './page'

export default class Disclaimer extends Page {
  constructor() {
    super('Usage')
  }

  disclaimerCheckbox = cy.contains('label', 'I confirm that I understand').prev()

  confirmDisclaimer = (): PageElement => {
    this.disclaimerCheckbox.click()
    return this.confirmButton().click()
  }

  confirmButton = (): PageElement => cy.get('button[type="submit"]')
}
