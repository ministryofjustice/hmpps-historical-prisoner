import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'
import DetailPage from '../pages/detail'

context('Detail', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(Disclaimer).confirmDisclaimer()
  })

  it('Will show prisoner detail', () => {
    cy.task('stubPrisonerDetail')

    cy.visit('/detail/A1234BC')
    Page.verifyOnPageWithTitleParam(DetailPage, 'Firsta Middlea SURNAMEA')
  })

  it('Will show prisoner summary', () => {
    cy.task('stubPrisonerDetail')

    cy.visit('/detail/A1234BC')
    Page.verifyOnPageWithTitleParam(DetailPage, 'Firsta Middlea SURNAMEA')

    cy.get('[data-qa="dob"]').contains('01/01/1980')
  })
})
