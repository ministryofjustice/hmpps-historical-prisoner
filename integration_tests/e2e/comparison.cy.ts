import Page from '../pages/page'
import ComparisonPage from '../pages/comparison'
import DetailPage from '../pages/detail'
import DisclaimerPage from '../pages/disclaimer'
import SearchPage from '../pages/search'

context('Comparison', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(DisclaimerPage).confirmDisclaimer()

    // need to carry out a search to get the results into the session
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    cy.task('stubPrisonerSearchByName')
    searchPage.searchButton().click()

    // add 3 items to shortlist
    searchPage.shortlistFormSubmit('BF123455').click()
    searchPage.shortlistFormSubmit('BF123456').click()
    searchPage.shortlistFormSubmit('BF123457').click()
  })

  it('Will include back link to search results page', () => {
    const searchPageFull = Page.verifyOnPage(SearchPage)
    cy.task('stubPrisonerDetail')
    searchPageFull.viewShortlistLink().click()

    const comparisonPage = Page.verifyOnPage(ComparisonPage)
    comparisonPage.backLink().click()

    const backLinkSearchPage = Page.verifyOnPage(SearchPage)

    // also ensure that search results are still displayed
    backLinkSearchPage.searchResults().should('exist')
    backLinkSearchPage.firstName().should('have.value', 'John')
  })

  describe('Will show all sections with data', () => {
    beforeEach(() => {
      const searchPageFull = Page.verifyOnPage(SearchPage)
      cy.task('stubComparisonPrisonerDetail', { prisonNumber: 'BF123455', lastName: 'SURNAMEA' })
      cy.task('stubComparisonPrisonerDetail', { prisonNumber: 'BF123456', lastName: 'SURNAMEB' })
      cy.task('stubComparisonPrisonerDetail', { prisonNumber: 'BF123457', lastName: 'SURNAMEC' })
      searchPageFull.viewShortlistLink().click()

      Page.verifyOnPage(ComparisonPage)
    })

    it('Will show prisoner summary', () => {
      cy.get(`[data-qa="name${0}"]`).should('contain.text', 'Firsta Middlea SURNAMEA')
      cy.get(`[data-qa="name${1}"]`).should('contain.text', 'Firsta Middlea SURNAMEB')
      cy.get(`[data-qa="name${2}"]`).should('contain.text', 'Firsta Middlea SURNAMEC')
      cy.get(`[data-qa="prisonNumber${0}"]`).should('have.text', 'BF123455')
      cy.get(`[data-qa="prisonNumber${1}"]`).should('have.text', 'BF123456')
      cy.get(`[data-qa="prisonNumber${2}"]`).should('have.text', 'BF123457')
      for (let i = 0; i < 3; i += 1) {
        cy.get(`[data-qa="dob${i}"]`).should('contain.text', '01/01/1980')
        cy.get(`[data-qa="remove-link${i}"]`).should('contain.value', 'Remove from shortlist')
      }
    })

    it('Will show prisoner background', () => {
      for (let i = 0; i < 3; i += 1) {
        cy.get(`[data-qa="gender${i}"]`).should('have.text', 'Male')
        cy.get(`[data-qa="ethnicity${i}"]`).should('have.text', 'White - British')
        cy.get(`[data-qa="birthCountry${i}"]`).should('have.text', 'Born in England')
        cy.get(`[data-qa="nationality${i}"]`).should('have.text', 'National of United Kingdom')
        cy.get(`[data-qa="religion${i}"]`).should('have.text', 'Church Of England')
      }
    })

    it('Will show prisoner aliases', () => {
      for (let i = 0; i < 3; i += 1) {
        cy.get(`[data-qa="prisoner${i}alias0"]`).should('have.text', 'Othera Aliasa, 01/01/1980')
        cy.get(`[data-qa="prisoner${i}alias1"]`).should('have.text', 'Otherb Aliasb, 02/01/1980')
      }
    })

    it('Will show prisoner addresses', () => {
      for (let i = 0; i < 3; i += 1) {
        cy.get(`[data-qa="prisoner${i}address0"]`).should('have.text', 'Other: 1, Street Road, Town A, Merseyside')
        cy.get(`[data-qa="prisoner${i}address1"]`).should('have.text', 'Unknown: Town B, Merseyside')
        cy.get(`[data-qa="prisoner${i}address2"]`).should(
          'have.text',
          'Next Of Kin: 3, Street Road, Town C, Merseyside',
        )
      }
    })
  })

  describe('Will show all sections with no data', () => {
    beforeEach(() => {
      const searchPageFull = Page.verifyOnPage(SearchPage)
      cy.task('stubPrisonerDetail', { summary: { prisonNumber: 'AB111111', lastName: 'SURNAMEA' } })
      searchPageFull.viewShortlistLink().click()

      Page.verifyOnPage(ComparisonPage)
    })

    it('Will show prisoner summary', () => {
      cy.get('[data-qa="name0"]').should('contain.text', 'SURNAMEA')
      cy.get('[data-qa="name1"]').should('contain.text', 'SURNAMEA')
      cy.get('[data-qa="name2"]').should('contain.text', 'SURNAMEA')
      cy.get('[data-qa="dob0"]').should('not.exist')
      cy.get('[data-qa="dob1"]').should('not.exist')
      cy.get('[data-qa="dob2"]').should('not.exist')
      cy.get('[data-qa="remove-link0"]').should('contain.value', 'Remove from shortlist')
      cy.get('[data-qa="remove-link1"]').should('contain.value', 'Remove from shortlist')
      cy.get('[data-qa="remove-link2"]').should('contain.value', 'Remove from shortlist')
    })

    it('Will show prisoner background', () => {
      cy.get('[data-qa="gender0"]').should('not.exist')
      cy.get('[data-qa="gender1"]').should('not.exist')
      cy.get('[data-qa="gender2"]').should('not.exist')
      cy.get('[data-qa="ethnicity0"]').should('not.exist')
      cy.get('[data-qa="ethnicity1"]').should('not.exist')
      cy.get('[data-qa="ethnicity2"]').should('not.exist')
      cy.get('[data-qa="birthCountry0"]').should('not.exist')
      cy.get('[data-qa="birthCountry1"]').should('not.exist')
      cy.get('[data-qa="birthCountry2"]').should('not.exist')
      cy.get('[data-qa="nationality0"]').should('not.exist')
      cy.get('[data-qa="nationality1"]').should('not.exist')
      cy.get('[data-qa="nationality2"]').should('not.exist')
      cy.get('[data-qa="religion0"]').should('not.exist')
      cy.get('[data-qa="religion1"]').should('not.exist')
      cy.get('[data-qa="religion2"]').should('not.exist')
    })

    it('Will show prisoner aliases', () => {
      cy.get('[data-qa="prisoner0alias0"]').should('contain.text', 'No aliases')
      cy.get('[data-qa="prisoner1alias0"]').should('contain.text', 'No aliases')
      cy.get('[data-qa="prisoner2alias0"]').should('contain.text', 'No aliases')
    })

    it('Will show prisoner addresses', () => {
      cy.get('[data-qa="prisoner0address0"]').should('contain.text', 'No addresses')
      cy.get('[data-qa="prisoner1address0"]').should('contain.text', 'No addresses')
      cy.get('[data-qa="prisoner1address0"]').should('contain.text', 'No addresses')
    })
  })

  describe('Will provide a link through to the detail page', () => {
    beforeEach(() => {
      const searchPageFull = Page.verifyOnPage(SearchPage)
      cy.task('stubPrisonerDetail')
      searchPageFull.viewShortlistLink().click()
    })

    it('Will link successfully to the details page', () => {
      const comparisonPage = Page.verifyOnPage(ComparisonPage)
      comparisonPage.detailLink(0).click()
      Page.verifyOnPageWithTitleParam(DetailPage, 'Firsta Middlea SURNAMEA')
    })

    it('Will link back to the comparison page after viewing details', () => {
      const comparisonPage = Page.verifyOnPage(ComparisonPage)
      comparisonPage.detailLink(0).click()
      const detailPage = Page.verifyOnPageWithTitleParam(DetailPage, 'Firsta Middlea SURNAMEA')
      detailPage.backLink().should('contain.text', 'Go back to comparison')
      detailPage.backLink().click()
      Page.verifyOnPage(ComparisonPage)
    })
  })

  describe('Will remove prisoners from the short list', () => {
    beforeEach(() => {
      const searchPageFull = Page.verifyOnPage(SearchPage)
      cy.task('stubComparisonPrisonerDetail', { prisonNumber: 'BF123455', lastName: 'SURNAMEA' })
      cy.task('stubComparisonPrisonerDetail', { prisonNumber: 'BF123456', lastName: 'SURNAMEB' })
      cy.task('stubComparisonPrisonerDetail', { prisonNumber: 'BF123457', lastName: 'SURNAMEC' })
      searchPageFull.viewShortlistLink().click()
    })

    it('Will remove an item from the shortlist and stay on the comparison page', () => {
      const comparisonPage = Page.verifyOnPage(ComparisonPage)
      comparisonPage.removeFromShortlist(0).should('exist')
      comparisonPage.removeFromShortlist(1).should('exist')
      comparisonPage.removeFromShortlist(2).should('exist')
      comparisonPage.removeFromShortlist(0).click()
      Page.verifyOnPage(ComparisonPage)
      comparisonPage.removeFromShortlist(0).should('exist')
      comparisonPage.removeFromShortlist(1).should('exist')
      comparisonPage.removeFromShortlist(2).should('not.exist')
    })

    it('Will return to the search page if all shortlist prisoners are removed', () => {
      const comparisonPage = Page.verifyOnPage(ComparisonPage)
      comparisonPage.removeFromShortlist(2).click()
      comparisonPage.removeFromShortlist(1).click()
      comparisonPage.removeFromShortlist(0).click()
      Page.verifyOnPage(SearchPage)
    })
  })

  it('Will return to the search page if attempt to reach comparison page with no prisoners to compare', () => {
    cy.task('stubComparisonPrisonerDetail', { prisonNumber: 'BF123455', lastName: 'SURNAMEA' })
    cy.task('stubComparisonPrisonerDetail', { prisonNumber: 'BF123456', lastName: 'SURNAMEB' })
    cy.task('stubComparisonPrisonerDetail', { prisonNumber: 'BF123457', lastName: 'SURNAMEC' })
    const searchPageFull = Page.verifyOnPage(SearchPage)
    searchPageFull.viewShortlistLink().click()
    const comparisonPage = Page.verifyOnPage(ComparisonPage)
    comparisonPage.removeFromShortlist(2).click()
    comparisonPage.removeFromShortlist(1).click()
    comparisonPage.removeFromShortlist(0).click()

    Page.verifyOnPage(SearchPage)
    cy.visit('/comparison')
    Page.verifyOnPage(SearchPage)
  })
})
