describe('Cypress Playground', () => {
  beforeEach(() => {
    const url = Cypress.env('environment') === 'prod'
      ? 'https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html'
      : './src/index.html'

    cy.visit(url)

    cy.injectAxe()
  })

  it('finds no a11 issues', () => {
    cy.checkA11y()
  })
})
