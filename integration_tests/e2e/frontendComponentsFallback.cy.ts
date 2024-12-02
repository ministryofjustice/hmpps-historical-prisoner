import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import HomePage from '../pages/disclaimer'

context('Frontend Components Fallback', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.task('stubGetComponentsMappingError')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can sign out', () => {
    cy.signIn()
    const landingPage = Page.verifyOnPage(HomePage)
    landingPage.signOutLink().click()
    Page.verifyOnPage(AuthSignInPage)
  })

  describe('Header', () => {
    it('should not show user name for the signed in user', () => {
      cy.task('stubSignIn', { name: 'Bobby Brown', roles: ['ROLE_HPA_USER'] })
      cy.signIn()
      const page = Page.verifyOnPage(HomePage)

      // headder, location and manage account not displayed in fallback
      page.headerUserName().should('not.exist')
      page.activeLocation().should('not.exist')
      page.manageAccountLink().should('not.exist')
    })

    it('should not show change location link in the fallback', () => {
      cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
      cy.signIn()

      const page = Page.verifyOnPage(HomePage)

      page.changeLocationLink().should('not.exist')
    })
  })
})
