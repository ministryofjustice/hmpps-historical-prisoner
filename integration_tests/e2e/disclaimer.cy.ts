import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'
import Search from '../pages/search'

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
    const disclaimerPageUpdate = Page.verifyOnPage(Disclaimer)
    disclaimerPageUpdate
      .errorSummaryList()
      .find('li')
      .then($errors => {
        expect($errors.get(0).innerText).to.contain('You must confirm that you understand the disclaimer')
      })
  })

  it('Will successfully move to the search screen if disclaimer checkbox selected', () => {
    navigateToDisclaimerPage()
    const disclaimerPage = Page.verifyOnPage(Disclaimer)
    disclaimerPage.disclaimerCheckbox.click()
    disclaimerPage.confirmButton().click()
    Page.verifyOnPage(Search)
  })

  const navigateToDisclaimerPage = () => {
    cy.signIn()
  }
})
