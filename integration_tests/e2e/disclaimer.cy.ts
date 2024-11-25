import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
  })

  it('Will show the disclaimer text', () => {
    navigateToDisclaimerPage()
    Page.verifyOnPage(Disclaimer)
  })

  it('Will provide a checkbox that is unchecked', () => {
    navigateToDisclaimerPage()
    const disclaimerPage = Page.verifyOnPage(Disclaimer)
    disclaimerPage.disclaimerCheckbox.should('not.be.checked')
  })

  it('Will return to disclaimer page and show an error if the disclaimer checkbox is not set', () => {
    navigateToDisclaimerPage()
    const disclaimerPage = Page.verifyOnPage(Disclaimer)
    disclaimerPage.confirmButton().click()
    Page.verifyOnPage(Disclaimer)
  })

  const navigateToDisclaimerPage = () => {
    cy.signIn()
  }
})
