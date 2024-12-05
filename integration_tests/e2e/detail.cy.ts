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

  describe('Will show all sections', () => {
    beforeEach(() => {
      cy.task('stubPrisonerDetail')
      cy.visit('/detail/A1234BC')
    })

    it('Will show prisoner detail', () => {
      Page.verifyOnPageWithTitleParam(DetailPage, 'Firsta Middlea SURNAMEA')
    })

    it('Will show prisoner summary', () => {
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

    it('Will show prisoner aliases', () => {
      cy.get('[data-qa="alias0"]').should('have.text', 'Othera A Aliasa')
      cy.get('[data-qa="aliasDob0"]').should('have.text', '01/01/1980')
      cy.get('[data-qa="alias1"]').should('have.text', 'Otherb B Aliasb')
      cy.get('[data-qa="aliasDob1"]').should('have.text', '02/01/1980')
    })

    it('Will show prisoner movements', () => {
      cy.get('[data-qa="movement0"]').should('have.text', 'OUT - Discharged to court')
      cy.get('[data-qa="movementDate0"]').should('have.text', '12/02/1988')
      cy.get('[data-qa="movementPrison0"]').should('have.text', 'Frankland')
      cy.get('[data-qa="movement1"]').should('have.text', 'IN - Unconvicted remand')
      cy.get('[data-qa="movementDate1"]').should('have.text', '21/12/1987')
      cy.get('[data-qa="movementPrison1"]').should('have.text', 'Durham')
    })
  })
})
