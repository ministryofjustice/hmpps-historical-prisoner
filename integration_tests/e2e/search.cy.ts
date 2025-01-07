import Page from '../pages/page'
import DisclaimerPage from '../pages/disclaimer'
import SearchPage from '../pages/search'

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

  describe('Will show/hide the suggestion link', () => {
    it('Will will show the suggestion link if searching by name', () => {
      cy.task('stubPrisonerSearchByName')
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.firstName().type('John')
      searchPage.doSearch()
      searchPage.suggestions().should('exist')
    })
    it('Will will not show the suggestion link if searching by id', () => {
      cy.task('stubPrisonerSearchByIdentifiers')
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.searchSelectRadioButton('Unique identifier').click()
      searchPage.prisonNumber().type('A1234BC')
      searchPage.doSearch()
      searchPage.suggestions().should('not.exist')
    })
    it('Will will not show the suggestion link if searching by address', () => {
      cy.task('stubPrisonerSearchByAddress')
      const searchPage = Page.verifyOnPage(SearchPage)
      searchPage.searchSelectRadioButton('Other').click()
      searchPage.address().type('Hill')
      searchPage.doSearch()
      searchPage.suggestions().should('not.exist')
    })
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
      .should('contain.text', 'Last name must not contain space, numbers or special characters')
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
