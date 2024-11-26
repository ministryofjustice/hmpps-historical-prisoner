import Page, { PageElement } from './page'

export default class Search extends Page {
  constructor() {
    super('Prisoner Search')
  }

  searchSelectRadioButton = text => cy.contains('label', text).prev()
}
