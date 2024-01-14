describe('Cypress Playground - Test Design Masterclas TAT', () => {
  it('visits the page and assert a expected text is visible', () => {
    cy.visit('./index.html')

    cy.contains('h1', 'Cypress Playground').should('be.visible')
    cy.contains('#visit h2', 'cy.visit()').should('be.visible')
  })
})