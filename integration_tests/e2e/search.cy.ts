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

  it('Will display data returned from the call', () => {
    cy.task('stubPrisonerSearchByName')

    const prisonerSearchPage = Page.verifyOnPage(Search)
    prisonerSearchPage.searchButton().click()
    prisonerSearchPage.searchResults().should('have.length', 2)
  })
})
