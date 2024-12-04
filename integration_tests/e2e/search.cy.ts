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
    const prisonerSearchPage = Page.verifyOnPage(Search)
    prisonerSearchPage.searchSelectRadioButton('Name/age').should('be.checked')
  })

  it('Will display search data entered when the search is performed', () => {
    cy.task('stubPrisonerSearchByName')

    const prisonerSearchPage = Page.verifyOnPage(Search)
    prisonerSearchPage.firstName().type('John')
    prisonerSearchPage.lastName().type('Smith')
    prisonerSearchPage.searchButton().click()
    prisonerSearchPage.firstName().should('have.value', 'John')
    prisonerSearchPage.lastName().should('have.value', 'Smith')
  })

  it('Will clear the search form when New Search is selected', () => {
    cy.task('stubPrisonerSearchByName')

    const prisonerSearchPage = Page.verifyOnPage(Search)

    prisonerSearchPage.firstName().type('John')
    prisonerSearchPage.lastName().type('Smith')
    prisonerSearchPage.searchButton().click()
    prisonerSearchPage.firstName().should('have.value', 'John')
    prisonerSearchPage.lastName().should('have.value', 'Smith')
    prisonerSearchPage.newSearch().click()
    prisonerSearchPage.firstName().should('be.empty')
    prisonerSearchPage.lastName().should('be.empty')
  })

  it('Will populate prisoners matched', () => {
    cy.task('stubPrisonerSearchByName')

    const prisonerSearchPage = Page.verifyOnPage(Search)
    prisonerSearchPage.searchButton().click()
    prisonerSearchPage.searchResults().should('have.length', 2)
  })

  it('Will populate prisoners matched with or without alias', () => {
    cy.task('stubPrisonerSearchByName')

    const prisonerSearchPage = Page.verifyOnPage(Search)
    prisonerSearchPage.searchButton().click()
    prisonerSearchPage.searchResults().should('have.length', 2)
    prisonerSearchPage.searchResults().eq(0).should('not.contain.text', 'Matched on alias')
    prisonerSearchPage.searchResults().eq(1).should('contain.text', 'Matched on alias GOLDIE WILSON')
  })

  it('Will show the Add to shortlist item for each row', () => {
    cy.task('stubPrisonerSearchByName')

    const prisonerSearchPage = Page.verifyOnPage(Search)
    prisonerSearchPage.searchButton().click()
    prisonerSearchPage.searchResults().should('have.length', 2)
    prisonerSearchPage.searchResults().eq(0).should('contain.text', 'Add to shortlist')
  })
})
