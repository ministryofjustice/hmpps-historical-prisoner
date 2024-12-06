import Page from '../pages/page'
import Disclaimer from '../pages/disclaimer'
import DetailPage from '../pages/detail'

context('Detail', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubFrontendComponents')
    cy.task('stubSignIn', { roles: ['ROLE_HPA_USER'] })
    cy.signIn()
    Page.verifyOnPage(Disclaimer).confirmDisclaimer()
  })

  describe('Will show all sections', () => {
    beforeEach(() => {
      cy.task('stubPrisonerDetail')
      cy.visit('/detail/A1234BC')
    })

    it('Will show prisoner detail', () => {
      Page.verifyOnPageWithTitleParam(DetailPage, 'Firsta Middlea SURNAMEA')
    })

    it('Will show prisoner summary', () => {
      cy.get('[data-qa="dob"]').should('contain.text', '01/01/1980')
      cy.get('[data-qa="gender"]').should('have.text', 'Male')
      cy.get('[data-qa="ethnicity"]').should('have.text', 'White')
      cy.get('[data-qa="birthCountry"]').should('have.text', 'England')
      cy.get('[data-qa="maritalStatus"]').should('have.text', 'Single')
      cy.get('[data-qa="nationality"]').should('have.text', 'United Kingdom')
      cy.get('[data-qa="religion"]').should('have.text', 'Church Of England')
      cy.get('[data-qa="prisonNumber"]').should('have.text', 'AB111111')
      cy.get('[data-qa="paroleNumbers"]').should('have.text', 'AA12311')
      cy.get('[data-qa="pncNumber"]').should('have.text', '012345/99A')
      cy.get('[data-qa="croNumber"]').should('have.text', '012345/99C')
    })

    it('Will show prisoner aliases', () => {
      cy.get('[data-qa="alias0"]').should('have.text', 'Othera A Aliasa')
      cy.get('[data-qa="aliasDob0"]').should('have.text', '01/01/1980')
      cy.get('[data-qa="alias1"]').should('have.text', 'Otherb B Aliasb')
      cy.get('[data-qa="aliasDob1"]').should('have.text', '02/01/1980')
    })

    it('Will show prisoner movements', () => {
      cy.get('[data-qa="movement0"]').should('have.text', 'OUT - Discharged to court')
      cy.get('[data-qa="movementDate0"]').should('have.text', '12/02/1988')
      cy.get('[data-qa="movementPrison0"]').should('have.text', 'Frankland')
      cy.get('[data-qa="movement1"]').should('have.text', 'IN - Unconvicted remand')
      cy.get('[data-qa="movementDate1"]').should('have.text', '21/12/1987')
      cy.get('[data-qa="movementPrison1"]').should('have.text', 'Durham')
    })

    it('Will show prisoner offences', () => {
      cy.get('[data-qa="offence0"]').should('have.text', '101')
      cy.get('[data-qa="offenceDate0"]').should('have.text', '01/01/2001')
      cy.get('[data-qa="offencePrison0"]').should('have.text', 'Belmarsh')
      cy.get('[data-qa="offence1"]').should('have.text', '48')
      cy.get('[data-qa="offenceDate1"]').should('have.text', '02/01/2001')
      cy.get('[data-qa="offencePrison1"]').should('have.text', 'Durham')
    })

    it('Will show prisoner sentence summary', () => {
      cy.get('[data-qa="sentenceSummaryCategory"]').should('contain.text', 'Uncategorised (sent Males)')
      cy.get('[data-qa="sentenceSummaryCategoryDate"]').should('have.text', '02/01/2001')
      cy.get('[data-qa="sentenceSummaryPrison"]').should('have.text', 'Frankland')
      cy.get('[data-qa="sentenceSummaryCourtHearing"]').should('have.text', 'Liskeard County Court')
      cy.get('[data-qa="sentenceSummaryCourtHearingDate"]').should('contain.text', '12/01/2001')
      cy.get('[data-qa="sentenceSummaryReceptionDate"]').should('have.text', '01/01/1999')
      cy.get('[data-qa="sentenceSummaryChangeDate"]').should('have.text', '01/01/2004')
      cy.get('[data-qa="sentenceSummarySentenceLength"]').should('have.text', '3027 days')
      cy.get('[data-qa="sentenceSummarySED"]').should('have.text', '01/01/2006')
      cy.get('[data-qa="sentenceSummaryLED"]').should('have.text', '03/03/2005')
      cy.get('[data-qa="sentenceSummaryCRD"]').should('have.text', '04/04/2004')
      cy.get('[data-qa="sentenceSummaryPED"]').should('have.text', '04/04/2005')
      cy.get('[data-qa="sentenceSummaryNPD"]').should('have.text', '04/04/2006')
      cy.get('[data-qa="sentenceSummaryHDCED"]').should('have.text', '03/03/2004')
      cy.get('[data-qa="sentenceSummaryHDCAD"]').should('have.text', '01/01/2001')
    })

    it('Will show prisoner sentencing', () => {
      cy.get('[data-qa="sentence0ChangeDate"]').should('have.text', '01/01/2004')
      cy.get('[data-qa="sentence0SentenceLength"]').should('have.text', '3027 days')
      cy.get('[data-qa="sentence0SED"]').should('have.text', '01/01/2006')
      cy.get('[data-qa="sentence0LED"]').should('have.text', '03/03/2005')
      cy.get('[data-qa="sentence0CRD"]').should('have.text', '04/04/2004')
      cy.get('[data-qa="sentence0PED"]').should('have.text', '04/04/2005')
      cy.get('[data-qa="sentence0NPD"]').should('have.text', '04/04/2006')
      cy.get('[data-qa="sentence0HDCED"]').should('have.text', '03/03/2004')
      cy.get('[data-qa="sentence0HDCAD"]').should('have.text', '01/01/2001')
      cy.get('[data-qa="sentence1ChangeDate"]').should('have.text', '01/01/2003')
      cy.get('[data-qa="sentence1SentenceLength"]').should('have.text', '2373 days')
      cy.get('[data-qa="sentence1SED"]').should('have.text', '02/02/2006')
      cy.get('[data-qa="sentence1LED"]').should('have.text', '02/02/2005')
      cy.get('[data-qa="sentence1CRD"]').should('have.text', '03/03/2004')
      cy.get('[data-qa="sentence1PED"]').should('not.exist')
      cy.get('[data-qa="sentence1NPD"]').should('not.exist')
      cy.get('[data-qa="sentence1HDCED"]').should('not.exist')
      cy.get('[data-qa="sentence1HDCAD"]').should('not.exist')
    })
  })
})
