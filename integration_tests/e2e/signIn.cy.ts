import DisclaimerPage from '../pages/disclaimer'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import AuthManageDetailsPage from '../pages/authManageDetails'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User name visible in header', () => {
    cy.signIn()
    const disclaimerPage = Page.verifyOnPage(DisclaimerPage)
    disclaimerPage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('Phase banner visible in header', () => {
    cy.signIn()
    const disclaimerPage = Page.verifyOnPage(DisclaimerPage)
    disclaimerPage.headerPhaseBanner().should('contain.text', 'DEV')
  })

  it('User can sign out', () => {
    cy.signIn()
    const disclaimerPage = Page.verifyOnPage(DisclaimerPage)
    disclaimerPage.signOutLink().click()
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can manage their details', () => {
    cy.signIn()
    cy.task('stubAuthManageDetails')
    const disclaimerPage = Page.verifyOnPage(DisclaimerPage)

    disclaimerPage.manageAccountLink().get('a').invoke('removeAttr', 'target')
    disclaimerPage.manageAccountLink().click()
    Page.verifyOnPage(AuthManageDetailsPage)
  })

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()
    Page.verifyOnPage(DisclaimerPage)
    cy.task('stubVerifyToken', false)

    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  describe('Header', () => {
    it('should display the correct details for the signed in user', () => {
      cy.signIn()
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
      cy.signIn()

      const page = Page.verifyOnPage(DisclaimerPage)

      page
        .changeLocationLink()
        .should('be.visible')
        .should('have.attr', 'href')
        .then(href => {
          expect(href).to.equal('http://localhost:3002/change-caseload')
        })
    })
  })
})
