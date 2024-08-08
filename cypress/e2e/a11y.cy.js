describe('Cypress Playground', () => {
  beforeEach(() => {
    if (Cypress.env('environment') === 'prod') {
      cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
    } else {
      cy.visit('./src/index.html')
    }

    cy.injectAxe()
  })

  it('finds no a11 issues', () => {
    cy.checkA11y()
  })
})
