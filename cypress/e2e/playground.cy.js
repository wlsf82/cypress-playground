describe('Cypress Playground', () => {
  beforeEach(() => {
    const date = new Date(Date.UTC(1982, 3, 15))

    cy.clock(date)

    if (Cypress.env('environment') === 'prod') {
      cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
    } else {
      cy.visit('./src/index.html')
    }
  })

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

  it("types in an input which 'signs' a form, then asserts it's signed", () => {
    cy.get('#type textarea').type('Mad Max')
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
    cy.get('#select select[name="selection-type"]').select('VIP')
    cy.contains('p', "You've selected: VIP")
  })

  it('selects multiple fruits via the dropdown field and asserts on the selection', () => {
    cy.contains('p', "You haven't selected any fruit yet.")
    cy.get('#select select[multiple]').select(['apple', 'banana', 'cherry'])
    cy.contains('p', "You've selected the following fruits: apple, banana, cherry")
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
    cy.contains('#intercept ul li', 'TODO ID: ').should('be.visible')
    cy.contains('#intercept ul li', 'Title: ').should('be.visible')
    cy.contains('#intercept ul li', 'Completed: ').should('be.visible')
    cy.contains('#intercept ul li', 'User ID: ').should('be.visible')
  })

  it('clicks a button and triggers a stubbed request', () => {
    const todo = require('../fixtures/todo')

    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { fixture: 'todo' }
      ).as('getTodo')
    cy.contains('#intercept button', 'Get TODO').click()
    cy.wait('@getTodo')
      .as('todo')
      .its('response.statusCode')
      .should('be.equal', 200)
    cy.contains('#intercept ul li', `TODO ID: ${todo.id}`).should('be.visible')
    cy.contains('#intercept ul li', `Title: ${todo.title}`).should('be.visible')
    cy.contains('#intercept ul li', `Completed: ${todo.completed}`).should('be.visible')
    cy.contains('#intercept ul li', `User ID: ${todo.userId}`).should('be.visible')
  })

  it('clicks a button and simulate an API failure', () => {
    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { statusCode: 500 }
      ).as('serverFailure')
    cy.contains('#intercept button', 'Get TODO').click()
    cy.wait('@serverFailure')
      .its('response.statusCode')
      .should('be.equal', 500)
    cy.contains(
      '#intercept .error span',
      'Oops, something went wrong. Refresh the page and try again.'
    ).should('be.visible')
  })

  it('clicks a button and simulate a network failure', () => {
    cy.intercept(
      'GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { forceNetworkError: true }
      ).as('networkError')
    cy.contains('#intercept button', 'Get TODO').click()
    cy.wait('@networkError')
    cy.contains(
      '#intercept .error span',
      'Oops, something went wrong. Check your internet connection, refresh the page, and try again.'
    ).should('be.visible')
  })

  it('makes an HTTP request and asserts on the returned status code', () => {
    cy.request('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .its('status')
      .should('be.equal', 200)
  })

  Cypress._.times(10, index => {
    it(`selects ${index + 1} out of 10`, () => {
      cy.get('#input-range input[type="range"]')
        .invoke('val', index + 1)
        .should('have.value', index + 1)
        .trigger('change')

      cy.contains('#input-range p', `You're on level: ${index + 1}`)
    })
  })

  it('selects a date and asserts the correct date has been displayed', () => {
    cy.get('#input-date input[type="date"]')
      .type('2024-01-16')
      .blur()

    cy.contains(
      '#input-date p#date-paragraph',
      "The date you've selected is: 2024-01-16"
    ).should('be.visible')
  })

  it('types a password without leaking it, shows it, and hides it again', () => {
    cy.get('#password-input input[type="password"]')
      .type(Cypress.env('PASSWORD'), { log: false })

    cy.get('#password-input input[type="checkbox"').check()

    cy.get('#password-input input[type="password"]').should('not.exist')
    cy.get('#password-input input[type="text"]')
      .should('be.visible')
      .and('have.value', Cypress.env('PASSWORD'))

    cy.get('#password-input input[type="checkbox"').uncheck()

    cy.get('#password-input input[type="text"]').should('not.exist')
    cy.get('#password-input input[type="password"]').should('be.visible')
  })

  it('count the number of animals in a list', () => {
    cy.get('#should-have-length ul li').should('have.length', 5)
  })

  it("freezes the browser clock and asserts the frozen date is displayed", () => {
    cy.contains(
      '#date-section #date-section-paragraph',
      'Date: 1982-04-15'
    )
  })

  it('copies the code, types it, submits it, then asserts on the success message', () => {
    cy.clock()
    cy.get('#copy-paste span#timestamp')
      .then(element => {
        const code = element[0].innerText

        cy.get('#copy-paste input[type="number"]').type(code)
        cy.contains('#copy-paste button', 'Submit').click()

        cy.contains('#copy-paste span', "Congrats! You've entered the correct code.")
          .should('be.visible')
        cy.tick(3000)

        cy.contains('#copy-paste span', "Congrats! You've entered the correct code.")
          .should('not.be.visible')
      })
  })

  it('copies the code, types it + 1, submits it, then asserts on the error message', () => {
    cy.clock()
    cy.get('#copy-paste span#timestamp')
      .then(element => {
        const code = element[0].innerText

        cy.get('#copy-paste input[type="number"]').type(`${code}1`)
        cy.contains('#copy-paste button', 'Submit').click()

        cy.contains('#copy-paste span', "The provided code isn't correct. Please, try again.")
          .should('be.visible')
        cy.tick(3000)

        cy.contains('#copy-paste span', "The provided code isn't correct. Please, try again.")
          .should('not.be.visible')
      })
  })
})
