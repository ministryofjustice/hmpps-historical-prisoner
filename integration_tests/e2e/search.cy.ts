import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'
import Search from '../pages/search'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    const disclaimerPage = Page.verifyOnPage(Disclaimer)
    disclaimerPage.disclaimerCheckbox.click()
    disclaimerPage.confirmButton().click()
  })

  it('Will show the search form with name/age selected', () => {
    const prisonerSearchPage = Page.verifyOnPage(Search)
    prisonerSearchPage.searchSelectRadioButton('Name/age').should('be.checked')
  })

  it('Will display search data entered when the page is reloaded', () => {
    cy.task('stubPrisonerSearchByName')

    const prisonerSearchPage = Page.verifyOnPage(Search)
    prisonerSearchPage.firstName().type('John')
    prisonerSearchPage.lastName().type('Smith')
    prisonerSearchPage.searchButton().click()
    prisonerSearchPage.firstName().should('have.value', 'John')
    prisonerSearchPage.lastName().should('have.value', 'Smith')
  })

  it('Will display data returned from the call', () => {
    cy.task('stubPrisonerSearchByName')

    const prisonerSearchPage = Page.verifyOnPage(Search)
    prisonerSearchPage.searchButton().click()
    prisonerSearchPage.searchResults().should('have.length', 2)
  })

  it('Will populate prisoners matched with or without alias', () => {
    cy.task('stubPrisonerSearchByName')

    const prisonerSearchPage = Page.verifyOnPage(Search)
    prisonerSearchPage.searchButton().click()
    prisonerSearchPage.searchResults().should('have.length', 2)
    prisonerSearchPage.searchResults().eq(0).should('not.contain.text', 'Matched on alias')
    prisonerSearchPage.searchResults().eq(1).should('contain.text', 'Matched on alias GOLDIE WILSON')
  })
})
