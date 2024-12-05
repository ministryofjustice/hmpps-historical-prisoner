import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'
import Search from '../pages/search'

context('Search', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(Disclaimer).confirmDisclaimer()
  })

  it('Will show the search form with name/age selected', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.searchSelectRadioButton('Name/age').should('be.checked')
  })

  it('Will display name search data entered when the search is performed', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.firstName().type('John')
    searchPage.lastName().type('Smith')
    searchPage.dobDay().type('25')
    searchPage.dobMonth().type('11')
    searchPage.dobYear().type('1986')
    searchPage.searchButton().click()
    searchPage.firstName().should('have.value', 'John')
    searchPage.lastName().should('have.value', 'Smith')
    // TODO fix
    // searchPage.dobDay().should('have.value', '25')
    // searchPage.dobMonth().should('have.value', '11')
    // searchPage.dobYear().should('have.value', '1986')
  })

  it('Will display identifier search data entered when the search is performed', () => {
    cy.task('stubPrisonerSearchByIdentifiers')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.searchSelectRadioButton('Unique identifier').click()
    searchPage.prisonNumber().type('A1234BC')
    searchPage.pncNumber().type('012345/99A')
    searchPage.croNumber().type('012345/CR0')
    searchPage.searchButton().click()
    searchPage.searchSelectRadioButton('Unique identifier').should('be.checked')
    searchPage.prisonNumber().should('have.value', 'A1234BC')
    searchPage.pncNumber().should('have.value', '012345/99A')
    searchPage.croNumber().should('have.value', '012345/CR0')
  })

  it('Will display address search data entered when the search is performed', () => {
    cy.task('stubPrisonerSearchByAddress')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.searchSelectRadioButton('Other').click()
    searchPage.address().type('Hill Valley')
    searchPage.searchButton().click()
    searchPage.searchSelectRadioButton('Other').should('be.checked')
    searchPage.address().should('have.value', 'Hill Valley')
  })

  it('Will clear the search form when New Search is selected', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.firstName().type('John')
    searchPage.lastName().type('Smith')
    searchPage.searchButton().click()
    searchPage.firstName().should('have.value', 'John')
    searchPage.lastName().should('have.value', 'Smith')
    searchPage.newSearch().click()
    searchPage.firstName().should('be.empty')
    searchPage.lastName().should('be.empty')
  })

  it('Will populate prisoners matched', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.searchButton().click()
    searchPage.searchResults().should('have.length', 2)
  })

  it('Will populate prisoners matched with or without alias', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.searchButton().click()
    searchPage.searchResults().should('have.length', 2)
    searchPage.searchResults().eq(0).should('not.contain.text', 'Matched on alias')
    searchPage.searchResults().eq(1).should('contain.text', 'Matched on alias GOLDIE WILSON')
  })

  it('Will show the Add to shortlist item for each row', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.searchButton().click()
    searchPage.searchResults().should('have.length', 2)
    searchPage.searchResults().eq(0).should('contain.text', 'Add to shortlist')
  })
})

context('Paging', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.task('stubPrisonerSearchByName')
    cy.signIn()
    Page.verifyOnPage(Disclaimer).confirmDisclaimer()
    const searchPage = Page.verifyOnPage(Search)
    searchPage.lastName().type('Wilson')
    searchPage.doSearch()
  })

  it('Will show the total prisoners returned', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.searchResultsCount().should('contain.text', '3 Prisoners')
  })

  it('Will show the total prisoners returned', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.searchResultsCount().should('contain.text', '3 Prisoners')
  })

  it('Will show paging information', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.getPaginationResults().should('contain.text', 'Showing 1 to 2 of 3 prisoners')
    searchWithResultsPage.nextPage()
    Page.verifyOnPage(Search)
  })
})
