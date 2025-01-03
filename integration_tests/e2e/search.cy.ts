import Page from '../pages/page'
import DisclaimerPage from '../pages/disclaimer'
import SearchPage from '../pages/search'
import ComparisonPage from '../pages/comparison'
import DetailPage from '../pages/detail'

context('Search', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(DisclaimerPage).confirmDisclaimer()
  })

  it('Will show the search form with name/age selected', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.searchSelectRadioButton('Name/age').should('be.checked')
  })

  it('Will display name search data entered when the search is performed', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.lastName().type('Smith')
    searchPage.dobDay().type('25')
    searchPage.dobMonth().type('11')
    searchPage.dobYear().type('1986')
    searchPage.searchButton().click()
    searchPage.firstName().should('have.value', 'John')
    searchPage.lastName().should('have.value', 'Smith')
    searchPage.dobDay().should('have.value', '25')
    searchPage.dobMonth().should('have.value', '11')
    searchPage.dobYear().should('have.value', '1986')
  })

  it('Will allow certain non-alphabetic characters in first and last name', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type("John-James's%*")
    searchPage.lastName().type("Smith-JonesO'Malley%*")
    searchPage.searchButton().click()
    searchPage.firstName().should('have.value', "John-James's%*")
    searchPage.lastName().should('have.value', "Smith-JonesO'Malley%*")
    searchPage.errorSummaryList().should('not.exist')
  })

  it('Will display identifier search data entered when the search is performed', () => {
    cy.task('stubPrisonerSearchByIdentifiers')
    const searchPage = Page.verifyOnPage(SearchPage)
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
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.searchSelectRadioButton('Other').click()
    searchPage.address().type('Hill Valley')
    searchPage.searchButton().click()
    searchPage.searchSelectRadioButton('Other').should('be.checked')
    searchPage.address().should('have.value', 'Hill Valley')
  })

  it('Will clear the search form when New SearchPage is selected', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
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

  it('Will show the Add to shortlist item for each row', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.shortlistFormSubmit('BF123455').should('have.value', 'Add to shortlist')
    searchPage.shortlistFormSubmit('BF123456').should('have.value', 'Add to shortlist')
  })

  it('Can add and remove items from the shortlist', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.shortlistFormSubmit('BF123455').should('have.value', 'Add to shortlist')
    searchPage.shortlistFormSubmit('BF123455').click()

    const searchPageWithRemove = Page.verifyOnPage(SearchPage)
    searchPageWithRemove.shortlistFormSubmit('BF123455').should('have.value', 'Remove from shortlist')
    searchPage.shortlistFormSubmit('BF123455').click()

    const searchPageWithAdd = Page.verifyOnPage(SearchPage)
    searchPageWithAdd.shortlistFormSubmit('BF123455').should('have.value', 'Add to shortlist')
  })

  it('Will show shortlist full when 3 prisoners added', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.shortlistFormSubmit('BF123455').click()
    searchPage.shortlistFormSubmit('BF123456').click()
    searchPage.shortlistFormSubmit('BF123457').click()

    const searchPageFull = Page.verifyOnPage(SearchPage)
    searchPageFull.shortlistFormSubmit('BF123458').should('have.value', 'Shortlist full - compare 3 prisoners')
    cy.task('stubPrisonerDetail')
    searchPageFull.shortlistFormSubmit('BF123458').click()

    Page.verifyOnPage(ComparisonPage)
  })

  it('Will provide suggestions link to improve search', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('John')
    searchPage.suggestions().should('not.exist')
    searchPage.searchButton().click()
    searchPage.suggestions().should('be.visible')
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

context('FormValidation', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(DisclaimerPage).confirmDisclaimer()
  })

  it('Will show an error if attempt to submit the name/age form without any data', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Please enter a value for at least one Name/age field')
  })

  it('Will show an error if attempt to submit the identifier form without any data', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.searchSelectRadioButton('Unique identifier').click()
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Please enter a value for at least one Identifier field')
  })

  it('Will show an error if attempt to submit the address form without any data', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.searchSelectRadioButton('Other').click()
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Please enter a value for the address field')
  })

  it('Will show an error if attempt to submit the first name form with invalid characters', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.firstName().type('dfg4')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage
      .errorSummaryList()
      .should('contain.text', 'First Name must not contain space, numbers or special characters')
  })

  it('Will show an error if attempt to submit the last name form with invalid characters', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.lastName().type('dfg4')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage
      .errorSummaryList()
      .should('contain.text', 'Surname must not contain space, numbers or special characters')
  })

  it('Will show an error if attempt to submit the dob with missing day', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.dobMonth().type('12')
    searchPage.dobYear().type('1984')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter a valid date of birth in the format DD/MM/YYYY')
  })

  it('Will show an error if attempt to submit the dob with missing month', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.dobDay().type('25')
    searchPage.dobYear().type('1984')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter a valid date of birth in the format DD/MM/YYYY')
  })

  it('Will show an error if attempt to submit the dob with missing year', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.dobDay().type('25')
    searchPage.dobDay().type('12')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter a valid date of birth in the format DD/MM/YYYY')
  })
  it('Will show an error if attempt to submit the dob with invalid characters', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.dobDay().type('et')
    searchPage.dobDay().type('12')
    searchPage.dobYear().type('1984')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter a valid date of birth in the format DD/MM/YYYY')
  })

  it('Will show an error if attempt to submit the dob with an invalid date', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.dobDay().type('31')
    searchPage.dobDay().type('11')
    searchPage.dobYear().type('1984')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter a valid date of birth in the format DD/MM/YYYY')
  })

  it('Will show an error if attempt to submit the age/range with an age too small', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.age().type('9')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('contain.text', 'Age must be a whole number')
  })
  it('Will show an error if attempt to submit the age/range with an age too big', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.age().type('200')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('contain.text', 'Age must be a whole number')
  })
  it('Will show an error if attempt to submit the age/range with a non-numerical age', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.age().type('wr')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('contain.text', 'Age must be a whole number')
  })
  it('Will show an error if attempt to submit the age/range with a negative age range', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.age().type('19-15')
    searchPage.doSearch()
    searchPage
      .errorSummaryList()
      .should('contain.text', 'Invalid age range. Age ranges should be be no larger than 10 years.')
  })
  it('Will show an error if attempt to submit the age/range with an age range more than 10 years', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.age().type('19-39')
    searchPage.doSearch()
    searchPage
      .errorSummaryList()
      .should('contain.text', 'Invalid age range. Age ranges should be be no larger than 10 years.')
  })
  it('Will show an error if attempt to submit the age/range with non-numerical age range', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.age().type('er-3245')
    searchPage.doSearch()
    searchPage
      .errorSummaryList()
      .should('contain.text', 'Invalid age range. Age ranges should be be no larger than 10 years.')
  })

  it('Will show an error if attempt to submit an address with only one word', () => {
    const searchPage = Page.verifyOnPage(SearchPage)
    searchPage.searchSelectRadioButton('Other').click()
    searchPage.address().type('Hill')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter at least 2 address elements')
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
