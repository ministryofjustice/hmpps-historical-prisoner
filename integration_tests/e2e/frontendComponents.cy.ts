import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import DisclaimerPage from '../pages/disclaimer'
import AuthManageDetailsPage from '../pages/authManageDetails'

context('Frontend Components', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.task('stubFrontendComponents')
    cy.signIn()
  })

  it('User can sign out', () => {
    const landingPage = Page.verifyOnPage(DisclaimerPage)
    landingPage.signOutLink().click()
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can manage their details', () => {
    cy.task('stubAuthManageDetails')
    const disclaimerPage = Page.verifyOnPage(DisclaimerPage)

    disclaimerPage.manageDetails().get('a').invoke('removeAttr', 'target')
    disclaimerPage.manageDetails().click()
    Page.verifyOnPage(AuthManageDetailsPage)
  })

  it('User name visible in header', () => {
    const disclaimerPage = Page.verifyOnPage(DisclaimerPage)
    disclaimerPage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('Phase banner visible in header', () => {
    const disclaimerPage = Page.verifyOnPage(DisclaimerPage)
    disclaimerPage.headerPhaseBanner().should('contain.text', 'DEV')
  })

  it('should display the correct details for the signed in user', () => {
    const page = Page.verifyOnPage(DisclaimerPage)

    page.headerUserName().contains('J. Smith')
    page.activeLocation().contains('Moorland')

    page
      .manageAccountLink()
      .should('have.attr', 'href')
      .then(href => {
        expect(href).to.equal('http://localhost:9091/auth/account-details')
      })
  })

  it('should show change location link when user has more than 1 caseload', () => {
    const page = Page.verifyOnPage(DisclaimerPage)

    page
      .changeLocationLink()
      .should('be.visible')
      .should('have.attr', 'href')
      .then(href => {
        expect(href).to.equal('http://localhost:3002/change-caseload')
      })
  })

  it('should display header even for post request errors', () => {
    const page = Page.verifyOnPage(DisclaimerPage)
    page.confirmButton().click()

    page.headerUserName().should('contain.text', 'J. Smith')
    page.activeLocation().contains('Moorland')
    page.signOutLink().should('exist')
  })
})
