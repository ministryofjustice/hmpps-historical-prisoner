import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'
import PrintPage from '../pages/print'
import DetailPage from '../pages/detail'

context('Print', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(Disclaimer).confirmDisclaimer()
  })

  it('Will ensure user has selected a section', () => {
    cy.task('stubPrisonerDetail')

    cy.visit('/print/A1234BC')
    const printPage = Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
    printPage.saveButton().click()

    const errorPage = Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
    errorPage.errorSummaryList().should('contain', 'Please select at least one section to print')
  })

  it('Will allow user to select multiple sections', () => {
    cy.task('stubPrisonerDetail')

    cy.visit('/print/A1234BC')
    const printPage = Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
    printPage.optionCheckbox('Subject').click()
    printPage.optionCheckbox('Court').click()
    printPage.saveButton().click()

    // TODO: change to pdf
    Page.verifyOnPageWithTitleParam(DetailPage, 'Firsta Middlea SURNAMEA')
  })

  it('Will allow user to select all sections', () => {
    cy.task('stubPrisonerDetail')

    cy.visit('/print/A1234BC')
    const printPage = Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
    printPage.optionCheckbox('All, I would like all details').click()
    printPage.saveButton().click()

    // TODO: change to pdf
    Page.verifyOnPageWithTitleParam(DetailPage, 'Firsta Middlea SURNAMEA')
  })
})
