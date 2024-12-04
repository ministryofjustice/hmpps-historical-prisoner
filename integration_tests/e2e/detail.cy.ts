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
    cy.get('[data-qa="gender"]').should('have.text', 'Male')
    cy.get('[data-qa="ethnicity"]').should('have.text', 'White')
    cy.get('[data-qa="birthCountry"]').should('have.text', 'England')
    cy.get('[data-qa="maritalStatus"]').should('have.text', 'Single')
    cy.get('[data-qa="nationality"]').should('have.text', 'United Kingdom')
    cy.get('[data-qa="religion"]').should('have.text', 'Church Of England')
    cy.get('[data-qa="prisonNumber"]').should('have.text', 'AB111111')
    cy.get('[data-qa="paroleNumbers"]').should('have.text', 'AA12311')
    cy.get('[data-qa="pncNumber"]').should('have.text', '012345/99A')
    cy.get('[data-qa="croNumber"]').should('have.text', '012345/99C')
  })
})
