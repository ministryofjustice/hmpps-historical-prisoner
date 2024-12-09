import Page, { PageElement } from './page'

export default class Detail extends Page {
  constructor(name: string) {
    super(name)
  }

  summaryLink = (): PageElement => cy.get('a[href="#summary"]')

  backToTopLink = (): PageElement => cy.get('[data-module=hmpps-back-to-top] a')

  backToTopLinkHidden = (): PageElement => cy.get('.hmpps-back-to-top--hidden')
}
