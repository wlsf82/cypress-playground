describe('Cypress Playground - Test Design Masterclas TAT', () => {
  it('visits the page and assert a expected text is visible', () => {
    cy.visit('./index.html')

    cy.contains('h1', 'Foo').should('be.visible')
    cy.contains('h2', 'bar').should('be.visible')
  })
})