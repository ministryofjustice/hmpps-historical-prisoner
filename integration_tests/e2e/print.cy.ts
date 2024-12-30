import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'
import PrintPage from '../pages/print'
import prisonerDetail from '../mockApis/prisonerDetail.json'
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
    cy.task('stubPrisonerDetail', {
      ...prisonerDetail,
      summary: { ...prisonerDetail.summary, prisonNumber: 'AB111112' },
    })

    cy.visit('/print/A1234BC')
    const printPage = Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
    printPage.optionCheckbox('Subject').click()
    printPage.optionCheckbox('Court').click()

    cy.task('stubCreatePdf')
    printPage.saveButton().click()

    cy.readFile(`${Cypress.config('downloadsFolder')}/print-AB111112.pdf`)

    // Expect to still be on the print page
    Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
  })

  it('Will allow user to select all sections', () => {
    cy.task('stubPrisonerDetail', {
      ...prisonerDetail,
      summary: { ...prisonerDetail.summary, prisonNumber: 'AB111113' },
    })

    cy.visit('/print/A1234BC')
    const printPage = Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
    printPage.optionCheckbox('All, I would like all details').click()

    cy.task('stubCreatePdf')
    printPage.saveButton().click()

    cy.readFile(`${Cypress.config('downloadsFolder')}/print-AB111113.pdf`)

    // Expect to still be on the print page
    Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
  })

  it('Will include back link to detail page', () => {
    cy.task('stubPrisonerDetail')

    cy.visit('/print/A1234BC')
    const printPage = Page.verifyOnPageWithTitleParam(PrintPage, 'Firsta SURNAMEA')
    printPage.backLink().click()

    Page.verifyOnPageWithTitleParam(DetailPage, 'Firsta Middlea SURNAMEA')
  })
})
