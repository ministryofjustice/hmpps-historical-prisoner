import Page from '../pages/page'
import SuggestionsPage from '../pages/suggestions'
import DisclaimerPage from '../pages/disclaimer'
import SearchPage from '../pages/search'

context('Suggestions', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(DisclaimerPage).confirmDisclaimer()
  })

  it('Back link will take user back to search results page with search pre-populated', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.suggestions().click()

    const suggestionsPage = Page.verifyOnPage(SuggestionsPage)
    suggestionsPage.backLink().click()
    const backToSearchPage = Page.verifyOnPage(SearchPage)
    backToSearchPage.firstName().should('have.value', 'John')
  })

  it('New search link will take user back to search page with search cleared', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.suggestions().click()

    const suggestionsPage = Page.verifyOnPage(SuggestionsPage)
    suggestionsPage.newSearch().click()
    const backToSearchPage = Page.verifyOnPage(SearchPage)
    backToSearchPage.firstName().should('have.value', '')
  })

  it('Will suggest using initial for forename', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.suggestions().click()

    const suggestionsPage = Page.verifyOnPage(SuggestionsPage)
    suggestionsPage.useInitial().within(() => {
      cy.get('span').should('have.text', 'J')
      cy.get('a').click()
    })

    Page.verifyOnPage(SearchPage).firstName().should('have.value', 'J')
  })

  it('Will suggest adding wildcard to forename', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('Alex')
    searchPage.searchButton().click()
    searchPage.suggestions().click()

    const suggestionsPage = Page.verifyOnPage(SuggestionsPage)
    suggestionsPage.forenameWildcard().within(() => {
      cy.get('span').should('have.text', 'Alex*')
      cy.get('a').click()
    })

    Page.verifyOnPage(SearchPage).firstName().should('have.value', 'Alex*')
  })

  it('Will suggest adding wildcard to surname', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.lastName().type('Smith')
    searchPage.searchButton().click()
    searchPage.suggestions().click()

    const suggestionsPage = Page.verifyOnPage(SuggestionsPage)
    suggestionsPage.surnameWildcard().within(() => {
      cy.get('span').should('have.text', 'Smith*')
      cy.get('a').click()
    })

    Page.verifyOnPage(SearchPage).lastName().should('have.value', 'Smith*')
  })

  it('Will suggest adding shorter wildcard to surname', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.lastName().type('Smith')
    searchPage.searchButton().click()
    searchPage.suggestions().click()

    const suggestionsPage = Page.verifyOnPage(SuggestionsPage)
    suggestionsPage.surnameShorterWildcard().within(() => {
      cy.get('span').should('have.text', 'Smi*')
      cy.get('a').click()
    })

    Page.verifyOnPage(SearchPage).lastName().should('have.value', 'Smi*')
  })
})
