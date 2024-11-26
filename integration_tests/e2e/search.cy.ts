import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'
import Search from '../pages/search'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
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
})
