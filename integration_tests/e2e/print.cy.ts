import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'
import PrintPage from '../pages/print'

context('Print', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(Disclaimer).confirmDisclaimer()
  })

  it('Will allow user to select multiple sections', () => {
    cy.task('stubPrisonerDetail')

    cy.visit('/print/A1234BC')
    const printPage = Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
    printPage.optionCheckbox('Subject').click()
    printPage.optionCheckbox('Court').click()
  })

  it('Will allow user to select all sections', () => {
    cy.task('stubPrisonerDetail')

    cy.visit('/print/A1234BC')
    const printPage = Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
    printPage.optionCheckbox('All, I would like all details').click()
  })
})
