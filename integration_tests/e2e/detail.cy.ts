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

  describe('Will show all sections with data', () => {
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

    it('Will show prisoner addresses', () => {
      cy.get('[data-qa="address0Type"]').should('have.text', 'Other')
      cy.get('[data-qa="address0Person"]').should('have.text', 'First Lasta')
      cy.get('[data-qa="address0Street"]').should('have.text', '1, Street Road')
      cy.get('[data-qa="address0Town"]').should('have.text', 'Town A')
      cy.get('[data-qa="address0County"]').should('have.text', 'Merseyside')
      cy.get('[data-qa="address1Type"]').should('have.text', 'Unknown')
      cy.get('[data-qa="address1Person"]').should('not.exist')
      cy.get('[data-qa="address1Street"]').should('not.exist')
      cy.get('[data-qa="address1Town"]').should('have.text', 'Town B')
      cy.get('[data-qa="address1County"]').should('have.text', 'Merseyside')
    })

    it('Will show prisoner movements', () => {
      cy.get('[data-qa="movement0"]').should('have.text', 'OUT - Discharged to court')
      cy.get('[data-qa="movementDate0"]').should('have.text', '12/02/1988')
      cy.get('[data-qa="movementPrison0"]').should('have.text', 'Frankland')
      cy.get('[data-qa="movement1"]').should('have.text', 'IN - Unconvicted remand')
      cy.get('[data-qa="movementDate1"]').should('have.text', '21/12/1987')
      cy.get('[data-qa="movementPrison1"]').should('have.text', 'Durham')
    })

    it('Will show prisoner court hearings', () => {
      cy.get('[data-qa="courtHearingDate0"]').should('have.text', '12/01/2001')
      cy.get('[data-qa="courtHearing0"]').should('have.text', 'Liskeard County Court')
      cy.get('[data-qa="courtHearingDate1"]').should('have.text', '04/01/2001')
      cy.get('[data-qa="courtHearing1"]').should('have.text', 'Wells County Court')
    })

    it('Will show prisoner HDC recalls', () => {
      cy.get('[data-qa="recall0RecallDate"]').should('have.text', '04/01/2001')
      cy.get('[data-qa="recall0CurfewEndDate"]').should('have.text', '05/01/2001')
      cy.get('[data-qa="recall0Outcome"]').should('have.text', 'Re-released following recall')
      cy.get('[data-qa="recall0OutcomeDate"]').should('have.text', '02/01/2001')
      cy.get('[data-qa="recall0Reason"]').should('have.text', 'Change of circs 38a1(b)')
      cy.get('[data-qa="recall1RecallDate"]').should('have.text', '01/01/2001')
      cy.get('[data-qa="recall1CurfewEndDate"]').should('have.text', '02/01/2001')
      cy.get('[data-qa="recall1Outcome"]').should('have.text', 'Licence revoked: recalled')
      cy.get('[data-qa="recall1OutcomeDate"]').should('have.text', '02/01/2001')
      cy.get('[data-qa="recall1Reason"]').should('have.text', 'Breach conditions 38a1(a)')
    })

    it('Will show prisoner HDC info', () => {
      cy.get('[data-qa="info0Stage-key"]').should('have.text', 'HDC eligibility result')
      cy.get('[data-qa="info0Date"]').should('have.text', '18/03/2013')
      cy.get('[data-qa="info0Status"]').should('have.text', 'Eligible')
      cy.get('[data-qa="info0Reasons"]').should('have.text', 'Created manually')
      cy.get('[data-qa="info1Stage-key"]').should('have.text', 'HDC eligibility')
      cy.get('[data-qa="info1Date"]').should('have.text', '18/03/2013')
      cy.get('[data-qa="info1Status"]').should('have.text', 'Manual check pass')
      cy.get('[data-qa="info1Reasons"]').should('have.text', 'Pass all eligibility checks')
    })

    it('Will show prisoner offences', () => {
      cy.get('[data-qa="offence0"]').should('have.text', '101')
      cy.get('[data-qa="offenceDate0"]').should('have.text', '01/01/2001')
      cy.get('[data-qa="offencePrison0"]').should('have.text', 'Belmarsh')
      cy.get('[data-qa="offence1"]').should('have.text', '48')
      cy.get('[data-qa="offenceDate1"]').should('have.text', '02/01/2001')
      cy.get('[data-qa="offencePrison1"]').should('have.text', 'Durham')
    })

    it('Will show prisoner offences in custody', () => {
      cy.get('[data-qa="offenceInCustody0Date"]').should('have.text', '04/01/1991')
      cy.get('[data-qa="offenceInCustody0Prison"]').should('have.text', 'Full Sutton')
      cy.get('[data-qa="offenceInCustody0Outcome"]').should('have.text', 'Dismissed')
      cy.get('[data-qa="offenceInCustody0Charge"]').should('have.text', 'Assault on inmate')
      cy.get('[data-qa="offenceInCustody0Punishment0Punishment"]').should('not.exist')
      cy.get('[data-qa="offenceInCustody2Date"]').should('have.text', '02/01/1991')
      cy.get('[data-qa="offenceInCustody2Prison"]').should('have.text', 'Durham')
      cy.get('[data-qa="offenceInCustody2Outcome"]').should('have.text', 'Not proven')
      cy.get('[data-qa="offenceInCustody2Charge"]').should('have.text', 'Offence against GOAD')
      cy.get('[data-qa="offenceInCustody2Punishment0Punishment"]').should('have.text', 'Extra work')
      cy.get('[data-qa="offenceInCustody2Punishment0Duration"]').should('have.text', '(21 days)')
    })

    it('Will show prisoner sentence summary', () => {
      cy.get('[data-qa="sentenceSummaryCategory"]').should('contain.text', 'Uncategorised (sent Males)')
      cy.get('[data-qa="sentenceSummaryCategoryDate"]').should('have.text', '02/01/2001')
      cy.get('[data-qa="sentenceSummaryPrison"]').should('have.text', 'Frankland')
      cy.get('[data-qa="sentenceSummaryCourtHearing"]').should('have.text', 'Liskeard County Court')
      cy.get('[data-qa="sentenceSummaryCourtHearingDate"]').should('contain.text', '12/01/2001')
      cy.get('[data-qa="sentenceSummaryReceptionDate"]').should('have.text', '01/01/1999')
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

  describe('Will show all sections with no data', () => {
    beforeEach(() => {
      cy.task('stubPrisonerDetail', { summary: { prisonNumber: 'AB111111', lastName: 'SURNAMEA' } })
      cy.visit('/detail/A1234BC')
    })

    it('Will show prisoner detail', () => {
      Page.verifyOnPageWithTitleParam(DetailPage, 'SURNAMEA')
    })

    it('Will show prisoner summary', () => {
      cy.get('[data-qa="dob"]').should('not.exist')
      cy.get('[data-qa="gender"]').should('not.exist')
      cy.get('[data-qa="ethnicity"]').should('not.exist')
      cy.get('[data-qa="birthCountry"]').should('not.exist')
      cy.get('[data-qa="maritalStatus"]').should('not.exist')
      cy.get('[data-qa="nationality"]').should('not.exist')
      cy.get('[data-qa="religion"]').should('not.exist')
      cy.get('[data-qa="prisonNumber"]').should('have.text', 'AB111111')
      cy.get('[data-qa="paroleNumbers"]').should('not.exist')
      cy.get('[data-qa="pncNumber"]').should('not.exist')
      cy.get('[data-qa="croNumber"]').should('not.exist')
    })

    it('Will not show prisoner addresses', () => {
      cy.get('[data-qa="noAddresses"]').should('exist')
    })

    it('Will not show prisoner aliases', () => {
      cy.get('[data-qa="noAliases"]').should('exist')
    })

    it('Will not show court hearings', () => {
      cy.get('[data-qa="noCourtHearings"]').should('exist')
    })

    it('Will not show hdc history', () => {
      cy.get('[data-qa="noHdc"]').should('exist')
    })

    it('Will not show prisoner movements', () => {
      cy.get('[data-qa="noMovements"]').should('exist')
    })

    it('Will not show prisoner offences', () => {
      cy.get('[data-qa="noOffences"]').should('exist')
    })

    it('Will not show prisoner offences in custody', () => {
      cy.get('[data-qa="noOffencesInCustody"]').should('exist')
    })

    it('Will not show prisoner sentence summary', () => {
      cy.get('[data-qa="noSentenceSummary"]').should('exist')
    })

    it('Will not show prisoner sentencing', () => {
      cy.get('[data-qa="noSentences"]').should('exist')
    })
  })
})
