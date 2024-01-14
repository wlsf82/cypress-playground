describe('Cypress Playground - Test Design Masterclas TAT', () => {
  beforeEach(() => cy.visit('./index.html'))

  it('after visiting a page, asserts some text is visible', () => {
    cy.contains('h1', 'Cypress Playground').should('be.visible')
    cy.contains('#visit h2', 'cy.visit()').should('be.visible')
  })

  it('clicks a button and ensure an action is triggered', () => {
    cy.contains('#click button', 'Subscribe').click()
  })
})