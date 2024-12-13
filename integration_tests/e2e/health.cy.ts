context('Healthcheck', () => {
  context('All healthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubHistoricalPrisonerPing')
      cy.task('stubTokenVerificationPing')
      cy.task('stubGotenbergPing')
    })

    it('Health check page is visible and UP', () => {
      cy.request('/health').its('body.status').should('equal', 'UP')
    })

    it('Ping is visible and UP', () => {
      cy.request('/ping').its('body.status').should('equal', 'UP')
    })

    it('Info is visible', () => {
      cy.request('/info').its('body').should('exist')
    })
  })

  context('Some unhealthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubHistoricalPrisonerPing')
      cy.task('stubTokenVerificationPing', 500)
      cy.task('stubGotenbergPing')
    })

    it('Reports correctly when token verification down', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).then(response => {
        expect(response.body.components.hmppsAuth.status).to.equal('UP')
        expect(response.body.components.historicalPrisonerApi.status).to.equal('UP')
        expect(response.body.components.tokenVerification.status).to.equal('DOWN')
        expect(response.body.components.tokenVerification.details).to.contain({ status: 500, retries: 2 })
      })
    })

    it('Health check page is visible and DOWN', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).its('body.status').should('equal', 'DOWN')
    })
  })
})
