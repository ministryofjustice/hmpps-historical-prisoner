import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'
import Search from '../pages/search'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
  })

  it('Will show the disclaimer text', () => {
    Page.verifyOnPage(Disclaimer)
    cy.title().should('eq', 'Usage')
  })

  it('Will provide a checkbox that is unchecked', () => {
    const disclaimerPage = Page.verifyOnPage(Disclaimer)
    disclaimerPage.disclaimerCheckbox.should('not.be.checked')
  })

  it('Will return to disclaimer page and show an error if the disclaimer checkbox is not set', () => {
    const disclaimerPage = Page.verifyOnPage(Disclaimer)
    disclaimerPage.confirmButton().click()
    const disclaimerPageUpdate = Page.verifyOnPage(Disclaimer)
    disclaimerPageUpdate
      .errorSummaryList()
      .find('li')
      .then($errors => {
        expect($errors.get(0).innerText).to.contain('You must confirm that you understand the disclaimer')
      })
    cy.title().should('eq', 'Error: Usage')
  })

  it('Will successfully move to the search screen if disclaimer checkbox selected', () => {
    const disclaimerPage = Page.verifyOnPage(Disclaimer)
    disclaimerPage.confirmDisclaimer()
    Page.verifyOnPage(Search)
  })

  it('Will bypass the disclaimer page if the user has already accepted the disclaimer', () => {
    cy.visit('/disclaimer')
    const disclaimerPage = Page.verifyOnPage(Disclaimer)
    disclaimerPage.confirmDisclaimer()

    Page.verifyOnPage(Search)

    cy.visit('/disclaimer')
    Page.verifyOnPage(Search)
  })

  it('Will take user to disclaimer page if not accepted disclaimer', () => {
    Page.verifyOnPage(Disclaimer)

    cy.visit('/search')
    Page.verifyOnPage(Disclaimer)
  })
})
