describe('Cypress Playground - Test Design Masterclas TAT', () => {
  beforeEach(() => cy.visit('./index.html'))

  it('after visiting a page, asserts some text is visible', () => {
    cy.contains('h1', 'Cypress Playground').should('be.visible')
    cy.contains('#visit h2', 'cy.visit()').should('be.visible')
  })

  it('clicks a button and ensure an action is triggered', () => {
    cy.clock()
    cy.contains('#click button', 'Subscribe').click()
    cy.contains(
      '#click span#success',
      "You've been successfully subscribed to our newsletter.",
    ).should('be.visible')
    cy.tick(3000)
    cy.contains(
      '#click span#success',
      "You've been successfully subscribed to our newsletter.",
    ).should('not.be.visible')
  })

  it('types in an input which "signs" a form', () => {
    cy.get('#type textarea').type('Hi, Cypress Test Design Masterclass!')
  })
})