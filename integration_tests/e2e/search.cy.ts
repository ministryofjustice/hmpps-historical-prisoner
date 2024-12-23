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
    searchPage.dobDay().should('have.value', '25')
    searchPage.dobMonth().should('have.value', '11')
    searchPage.dobYear().should('have.value', '1986')
  })

  it('Will allow certain non-alphabetic characters in first and last name', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.firstName().type("John-James's%*")
    searchPage.lastName().type("Smith-JonesO'Malley%*")
    searchPage.searchButton().click()
    searchPage.firstName().should('have.value', "John-James's%*")
    searchPage.lastName().should('have.value', "Smith-JonesO'Malley%*")
    searchPage.errorSummaryList().should('not.exist')
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
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.searchResults().should('have.length', 2)
  })

  it('Will populate prisoners matched with or without alias', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.searchResults().should('have.length', 2)
    searchPage.searchResults().eq(0).should('not.contain.text', 'Matched on alias')
    searchPage.searchResults().eq(1).should('contain.text', 'Matched on alias GOLDIE WILSON')
  })

  it('Will show the Add to shortlist item for each row', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.firstName().type('John')
    searchPage.searchButton().click()
    searchPage.searchResults().should('have.length', 2)
    searchPage.searchResults().eq(0).should('contain.text', 'Add to shortlist')
  })

  it('Will provide suggestions link to improve search', () => {
    cy.task('stubPrisonerSearchByName')
    const searchPage = Page.verifyOnPage(Search)
    searchPage.firstName().type('John')
    searchPage.suggestions().should('not.exist')
    searchPage.searchButton().click()
    searchPage.suggestions().should('be.visible')
  })
})

context('FormValidation', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(Disclaimer).confirmDisclaimer()
  })

  it('Will show an error if attempt to submit the name/age form without any data', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Please enter a value for at least one Name/age field')
  })

  it('Will show an error if attempt to submit the identifier form without any data', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.searchSelectRadioButton('Unique identifier').click()
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Please enter a value for at least one Identifier field')
  })

  it('Will show an error if attempt to submit the address form without any data', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.searchSelectRadioButton('Other').click()
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Please enter a value for the address field')
  })

  it('Will show an error if attempt to submit the first name form with invalid characters', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.firstName().type('dfg4')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage
      .errorSummaryList()
      .should('contain.text', 'First Name must not contain space, numbers or special characters')
  })

  it('Will show an error if attempt to submit the last name form with invalid characters', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.lastName().type('dfg4')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage
      .errorSummaryList()
      .should('contain.text', 'Surname must not contain space, numbers or special characters')
  })

  it('Will show an error if attempt to submit the dob with missing day', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.dobMonth().type('12')
    searchPage.dobYear().type('1984')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter a valid date of birth in the format DD/MM/YYYY')
  })

  it('Will show an error if attempt to submit the dob with missing month', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.dobDay().type('25')
    searchPage.dobYear().type('1984')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter a valid date of birth in the format DD/MM/YYYY')
  })

  it('Will show an error if attempt to submit the dob with missing year', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.dobDay().type('25')
    searchPage.dobDay().type('12')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter a valid date of birth in the format DD/MM/YYYY')
  })
  it('Will show an error if attempt to submit the dob with invalid characters', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.dobDay().type('et')
    searchPage.dobDay().type('12')
    searchPage.dobYear().type('1984')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter a valid date of birth in the format DD/MM/YYYY')
  })

  it('Will show an error if attempt to submit the dob with an invalid date', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.dobDay().type('31')
    searchPage.dobDay().type('11')
    searchPage.dobYear().type('1984')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('exist')
    searchPage.errorSummaryList().should('contain.text', 'Enter a valid date of birth in the format DD/MM/YYYY')
  })

  it('Will show an error if attempt to submit the age/range with an age too small', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.age().type('9')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('contain.text', 'Age must be a whole number')
  })
  it('Will show an error if attempt to submit the age/range with an age too big', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.age().type('200')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('contain.text', 'Age must be a whole number')
  })
  it('Will show an error if attempt to submit the age/range with a non-numerical age', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.age().type('wr')
    searchPage.doSearch()
    searchPage.errorSummaryList().should('contain.text', 'Age must be a whole number')
  })
  it('Will show an error if attempt to submit the age/range with a negative age range', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.age().type('19-15')
    searchPage.doSearch()
    searchPage
      .errorSummaryList()
      .should('contain.text', 'Invalid age range. Age ranges should be be no larger than 10 years.')
  })
  it('Will show an error if attempt to submit the age/range with an age range more than 10 years', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.age().type('19-39')
    searchPage.doSearch()
    searchPage
      .errorSummaryList()
      .should('contain.text', 'Invalid age range. Age ranges should be be no larger than 10 years.')
  })
  it('Will show an error if attempt to submit the age/range with non-numerical age range', () => {
    const searchPage = Page.verifyOnPage(Search)
    searchPage.age().type('er-3245')
    searchPage.doSearch()
    searchPage
      .errorSummaryList()
      .should('contain.text', 'Invalid age range. Age ranges should be be no larger than 10 years.')
  })

  it('Will show an error if attempt to submit an address with only one word', () => {
    const searchPage = Page.verifyOnPage(Search)
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
    Page.verifyOnPage(Disclaimer).confirmDisclaimer()
    const searchPage = Page.verifyOnPage(Search)
    searchPage.lastName().type('Wilson')
    searchPage.doSearch()
  })

  it('Will show the total prisoners returned', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.searchResultsCount().should('contain.text', '3 prisoners')
  })

  it('Will show the total prisoners returned', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.searchResultsCount().should('contain.text', '3 prisoners')
  })

  it('Will show paging information', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.getPaginationResults().should('contain.text', 'Showing 1 to 2 of 3 prisoners')
    searchWithResultsPage.nextPage()
    Page.verifyOnPage(Search)
  })
})

context('Filtering', () => {
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

  it('Will show all filters as not selected', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.maleFilter().should('be.visible')
    searchWithResultsPage.maleFilter().should('not.have.class', 'selected')
    searchWithResultsPage.femaleFilter().should('be.visible')
    searchWithResultsPage.femaleFilter().should('not.have.class', 'selected')
    searchWithResultsPage.hdcFilter().should('be.visible')
    searchWithResultsPage.hdcFilter().should('not.have.class', 'selected')
    searchWithResultsPage.liferFilter().should('be.visible')
    searchWithResultsPage.liferFilter().should('not.have.class', 'selected')
  })

  it('Will show the filter selected, if pressed', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.maleFilter().click()
    searchWithResultsPage.maleFilter().should('be.visible')
    searchWithResultsPage.maleFilter().should('have.class', 'selected')
  })

  it('Will deselect the filter if reselected', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.maleFilter().click()
    searchWithResultsPage.maleFilter().should('be.visible')
    searchWithResultsPage.maleFilter().should('have.class', 'selected')
    searchWithResultsPage.maleFilter().should('not.have.class', 'unselected')
    searchWithResultsPage.maleFilter().click()
    searchWithResultsPage.maleFilter().should('have.class', 'unselected')
    searchWithResultsPage.maleFilter().should('not.have.class', 'selected')
  })

  it('Will link to page 1 as part of filter when deselected', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.maleFilter().should('not.have.class', 'selected')
    searchWithResultsPage.maleFilter().should('have.attr', 'href').and('include', 'page=1')
  })

  it('Will link to page 1 as part of filter when selected', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.maleFilter().click()
    searchWithResultsPage.maleFilter().should('have.class', 'selected')
    searchWithResultsPage.maleFilter().should('have.attr', 'href').and('include', 'page=1')
  })

  it('Will add previously selected filters to other filter links', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.maleFilter().click()
    searchWithResultsPage.femaleFilter().should('have.attr', 'href').and('include', 'filters=male&page=1')
    searchWithResultsPage.maleFilter().click()
    searchWithResultsPage.maleFilter().should('have.class', 'selected')
    searchWithResultsPage.maleFilter().should('have.attr', 'href').and('include', 'page=1')
  })

  it('Will not include filter in link if previously selected', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.maleFilter().click()
    searchWithResultsPage.maleFilter().should('have.class', 'selected')
    searchWithResultsPage.maleFilter().should('have.attr', 'href').and('not.include', 'filters=male')
    searchWithResultsPage.maleFilter().should('have.attr', 'href').and('include', 'page=1')
  })

  it('Will show multiple selected filters', () => {
    const searchWithResultsPage = Page.verifyOnPage(Search)
    searchWithResultsPage.maleFilter().click()
    searchWithResultsPage.femaleFilter().click()
    searchWithResultsPage.maleFilter().should('have.class', 'selected')
    searchWithResultsPage.femaleFilter().should('have.class', 'selected')
  })
})
