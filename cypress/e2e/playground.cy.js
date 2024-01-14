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

  it('types in an input which "signs" a form, then blurs it to see the result', () => {
    cy.get('#type textarea').type('Mad Max').blur()
    cy.contains('#type em', 'Mad Max').should('be.visible')
  })

  it('types in the signature, then checks the checkbox to see the preview, then unchecks it', () => {
    cy.get('#check textarea').type('Scarecrow')
    cy.get('#check input[type="checkbox"]').check()
    cy.contains('#check em', 'Scarecrow').should('be.visible')
    cy.get('#check input[type="checkbox"]').uncheck()
    cy.contains('#check em', 'Scarecrow').should('not.exist')
  })

  it('checks both possible radios and asserts if it is "on" or "off"', () => {
    cy.contains('#check-radio p', 'ON')
      .should('be.visible')
      .and('have.css', 'color', 'rgb(0, 128, 0)')
    cy.get('#check-radio input[type="radio"][value="off"]').check()
    cy.contains('#check-radio p', 'ON').should('not.exist')
    cy.contains('#check-radio p', 'OFF')
      .should('be.visible')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
    cy.get('#check-radio input[type="radio"][value="on"]').check()
    cy.contains('#check-radio p', 'OFF').should('not.exist')
    cy.contains('#check-radio p', 'ON')
      .should('be.visible')
      .and('have.css', 'color', 'rgb(0, 128, 0)')
  })

  it('selects a type via the dropdown field and asserts on the selection', () => {
    cy.contains('p', "You haven't selected a type yet.")
    cy.get('#select select').select('VIP')
    cy.contains('p', "You've selected: VIP")
  })

  it('uploads a file and asserts the correct file name appears as a paragraph', () => {
    cy.get('#select-file input[type="file"]')
      .selectFile('cypress/fixtures/example.json')
    cy.contains(
      'p',
      'The following file has been selected for upload: example.json'
    ).should('be.visible')
  })

  it('clicks a button and triggers a request', () => {
    cy.intercept('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .as('getTodo')
    cy.contains('#intercept button', 'Get TODO').click()
    cy.wait('@getTodo')
      .as('todo')
      .its('response.statusCode')
      .should('be.equal', 200)
    cy.get('@todo')
      .its('response.body.id')
      .should('be.equal', 1)
  })
})
