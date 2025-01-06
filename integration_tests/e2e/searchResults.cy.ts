import Page from '../pages/page'
import DisclaimerPage from '../pages/disclaimer'
import SearchPage from '../pages/search'
import SuggestionsPage from '../pages/suggestions'
import DetailPage from '../pages/detail'
import ComparisonPage from '../pages/comparison'

context('Search Results', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(DisclaimerPage).confirmDisclaimer()
  })

  it('Will populate prisoners matched', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.searchResults().should('have.length', 4)
  })

  it('Will populate prisoners matched with or without alias', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.searchResults().should('have.length', 4)
    searchPage.searchResults().eq(0).should('not.contain.text', 'Matched on alias')
    searchPage.searchResults().eq(1).should('contain.text', 'Matched on alias GOLDIE WILSON')
  })

  it('Will provide suggestions link to improve search', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.suggestions().should('not.exist')
    searchPage.searchButton().click()
    searchPage.suggestions().should('be.visible')
    searchPage.suggestions().click()
    Page.verifyOnPage(SuggestionsPage)
  })

  it('Will provide link to prisoner details', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()

    const searchPageResults = Page.verifyOnPage(SearchPage)
    searchPageResults.detailLink('BF123458').should('contain.text', 'Smith Middle WILSON')
    cy.task('stubPrisonerDetail')

    searchPageResults.detailLink('BF123458').click()
    Page.verifyOnPageWithTitleParam(DetailPage, 'Firsta Middlea SURNAMEA')
  })
})

context('Shortlist', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(DisclaimerPage).confirmDisclaimer()
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
  })

  it('Will show the Add to shortlist item for each row', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.shortlistFormSubmit('BF123455').should('have.value', 'Add to shortlist')
    searchPage.shortlistFormSubmit('BF123456').should('have.value', 'Add to shortlist')
  })

  it('Can add and remove items from the shortlist', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.shortlistFormSubmit('BF123455').should('have.value', 'Add to shortlist')
    searchPage.shortlistFormSubmit('BF123455').click()

    const searchPageWithRemove = Page.verifyOnPage(SearchPage)
    searchPageWithRemove.shortlistFormSubmit('BF123455').should('have.value', 'Remove from shortlist')
    searchPage.shortlistFormSubmit('BF123455').click()

    const searchPageWithAdd = Page.verifyOnPage(SearchPage)
    searchPageWithAdd.shortlistFormSubmit('BF123455').should('have.value', 'Add to shortlist')
  })

  it('Will not show shortlist when 3 prisoners added', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.shortlistFormSubmit('BF123455').click()
    searchPage.shortlistFormSubmit('BF123456').click()
    searchPage.shortlistFormSubmit('BF123457').click()

    const searchPageFull = Page.verifyOnPage(SearchPage)
    searchPageFull.shortlistFormSubmit('BF123458').should('not.exist')
  })

  it('Will dynamically change view shortlist based on shortlist size', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.viewShortlistLink().should('not.exist')

    searchPage.shortlistFormSubmit('BF123455').click()
    searchPage.viewShortlistLink().should('contain.text', 'View shortlist')

    searchPage.shortlistFormSubmit('BF123456').click()
    searchPage.viewShortlistLink().should('contain.text', 'Compare 2 prisoners')

    searchPage.shortlistFormSubmit('BF123457').click()
    searchPage.viewShortlistLink().should('contain.text', 'Compare 3 prisoners')

    searchPage.shortlistFormSubmit('BF123458').should('not.exist')
  })

  it('Will link to the comparison page', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.shortlistFormSubmit('BF123455').click()
    searchPage.viewShortlistLink().should('contain.text', 'View shortlist')

    cy.task('stubPrisonerDetail')
    searchPage.viewShortlistLink().click()
    Page.verifyOnPage(ComparisonPage)
  })

  it('Will link to the comparison page when multiple prisoners added', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.shortlistFormSubmit('BF123455').click()
    searchPage.shortlistFormSubmit('BF123456').click()
    searchPage.viewShortlistLink().should('contain.text', 'Compare 2 prisoners')

    cy.task('stubPrisonerDetail')
    searchPage.viewShortlistLink().click()
    Page.verifyOnPage(ComparisonPage)
  })

  it('Performing new search will still remember shortlist', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.shortlistFormSubmit('BF123455').click()

    searchPage.newSearch().click()
    searchPage.lastName().type('John')
    searchPage.searchButton().click()
    searchPage.viewShortlistLink().should('contain.text', 'View shortlist')
    searchPage.shortlistFormSubmit('BF123455').should('have.value', 'Remove from shortlist')
  })
})

context('Paging', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.task('stubPrisonerSearchByName')
    cy.signIn()
    Page.verifyOnPage(DisclaimerPage).confirmDisclaimer()
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.lastName().type('Wilson')
    searchPage.doSearch()
  })

  it('Will show the total prisoners returned', () => {
    const searchWithResultsPage = Page.verifyOnPage(SearchPage)
    searchWithResultsPage.searchResultsCount().should('contain.text', '6 prisoners')
  })

  it('Will show paging information', () => {
    const searchWithResultsPage = Page.verifyOnPage(SearchPage)
    searchWithResultsPage.getPaginationResults().should('contain.text', 'Showing 1 to 4 of 6 prisoners')
    searchWithResultsPage.nextPage()
    Page.verifyOnPage(SearchPage)
  })
})

context('Filtering', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.task('stubPrisonerSearchByName')
    cy.signIn()
    Page.verifyOnPage(DisclaimerPage).confirmDisclaimer()
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.lastName().type('Wilson')
    searchPage.doSearch()
  })

  it('Will show all filters as not selected', () => {
    const searchWithResultsPage = Page.verifyOnPage(SearchPage)
    searchWithResultsPage.filter('Male').should('be.visible')
    searchWithResultsPage.filter('Male').should('not.have.class', 'selected')
    searchWithResultsPage.filter('Female').should('be.visible')
    searchWithResultsPage.filter('Female').should('not.have.class', 'selected')
    searchWithResultsPage.filter('HDC').should('be.visible')
    searchWithResultsPage.filter('HDC').should('not.have.class', 'selected')
    searchWithResultsPage.filter('Lifer').should('be.visible')
    searchWithResultsPage.filter('Lifer').should('not.have.class', 'selected')
  })

  it('Will show the filter selected, if pressed', () => {
    const searchWithResultsPage = Page.verifyOnPage(SearchPage)
    searchWithResultsPage.filter('Male').click()
    searchWithResultsPage.filter('Male').should('be.visible')
    searchWithResultsPage.filter('Male').should('have.class', 'selected')
  })

  it('Will deselect the filter if reselected', () => {
    const searchWithResultsPage = Page.verifyOnPage(SearchPage)
    searchWithResultsPage.filter('Male').click()
    searchWithResultsPage.filter('Male').should('be.visible')
    searchWithResultsPage.filter('Male').should('have.class', 'selected')
    searchWithResultsPage.filter('Male').should('not.have.class', 'unselected')
    searchWithResultsPage.filter('Male').click()
    searchWithResultsPage.filter('Male').should('have.class', 'unselected')
    searchWithResultsPage.filter('Male').should('not.have.class', 'selected')
  })

  it('Will link to page 1 as part of filter when deselected', () => {
    const searchWithResultsPage = Page.verifyOnPage(SearchPage)
    searchWithResultsPage.filter('Male').should('not.have.class', 'selected')
    searchWithResultsPage.filter('Male').should('have.attr', 'href').and('include', 'page=1&filters=male')
  })

  it('Will link to page 1 as part of filter when selected', () => {
    const searchWithResultsPage = Page.verifyOnPage(SearchPage)
    searchWithResultsPage.filter('Male').click()
    searchWithResultsPage.filter('Male').should('have.class', 'selected')
    searchWithResultsPage.filter('Male').should('have.attr', 'href').and('include', 'page=1')
  })

  it('Will add previously selected filters to other filter links', () => {
    const searchWithResultsPage = Page.verifyOnPage(SearchPage)
    searchWithResultsPage.filter('Male').click()
    searchWithResultsPage.filter('Male').should('have.attr', 'href').and('include', 'page=1')
    searchWithResultsPage.filter('Female').should('have.attr', 'href').and('include', 'filters=female')
    searchWithResultsPage.filter('Female').should('have.attr', 'href').and('include', 'filters=male')
  })

  it('Will not include filter in link if previously selected', () => {
    const searchWithResultsPage = Page.verifyOnPage(SearchPage)
    searchWithResultsPage.filter('Male').click()
    searchWithResultsPage.filter('Male').should('have.class', 'selected')
    searchWithResultsPage.filter('Male').should('have.attr', 'href').and('not.include', 'filters=male')
    searchWithResultsPage.filter('Male').should('have.attr', 'href').and('include', 'page=1')
  })

  it('Will show multiple selected filters', () => {
    const searchWithResultsPage = Page.verifyOnPage(SearchPage)
    searchWithResultsPage.filter('Male').click()
    searchWithResultsPage.filter('Female').click()
    searchWithResultsPage.filter('Male').should('have.class', 'selected')
    searchWithResultsPage.filter('Female').should('have.class', 'selected')
  })
})
