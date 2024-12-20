const { test, expect } = require('@playwright/test')
const { times } = require('lodash')

const fs = require('fs')
const path = require('path')

test.beforeEach(async ({ page }) => {
  const date = new Date(Date.UTC(1982, 3, 15))
  await page.clock.setFixedTime(date)

  // const environment = process.env.ENVIRONMENT
  // const url = environment === 'prod'
  //   ? 'https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html'
  //   : './src/index.html'
  // await page.goto(url)
  await page.goto('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
})

test.describe('Playwright Playground', () => {
  test('shows a promotional banner', async ({ page }) => {
    const banner = await page.locator('#promotional-banner')
    expect(await banner).toBeVisible()
    expect(await banner.innerText()).toContain('📣 Get to know the Cypress, from Zero to the Cloud course!')

    const link = await banner.locator('a')
    expect(await link.getAttribute('target')).toEqual('_blank')
    expect(await link.getAttribute('href')).toEqual('https://www.udemy.com/course/cypress-from-zero-to-the-cloud/?referralCode=CABCDDFA5ADBB7BE2E1A')
  })

  test('after visiting a page, asserts some text is visible', async ({ page }) => {
    const header = await page.locator('h1')
    expect(await header).toBeVisible()
    expect(await header.innerText()).toContain('Cypress Playground')

    const subHeader = await page.locator('#visit h2')
    expect(await subHeader).toBeVisible()
    expect(await subHeader.innerText()).toEqual('cy.visit()')
  })

  test('clicks a button and ensures an action is triggered', async ({ page }) => {
    const successMessage = await page.locator('#click span#success')
    await page.click('#click button')
    expect(await successMessage).toBeVisible()
    expect(await successMessage.innerText()).toEqual("You've been successfully subscribed to our newsletter.")

    await page.clock.runFor(4000)
    expect(await successMessage).not.toBeVisible()
  })

  test("types in an input which 'signs' a form, then asserts it's signed", async ({ page }) => {
    await page.fill('#type textarea', 'Mad Max')
    const signedText = await page.locator('#type em')
    expect(await signedText).toBeVisible()
    expect(await signedText.innerText()).toEqual('Mad Max')
  })

  test('types in the signature, checks the checkbox to see the preview, then unchecks it', async ({ page }) => {
    await page.fill('#check textarea', 'Scarecrow')
    await page.check('#check input[type="checkbox"]')
    const preview = await page.locator('#check em')
    expect(await preview).toBeVisible()
    expect(await preview.innerText()).toEqual('Scarecrow')

    await page.uncheck('#check input[type="checkbox"]')
    expect(await preview).not.toBeVisible()
  })

  test('checks both radios and asserts if it is "on" or "off"', async ({ page }) => {
    const radioOn = await page.locator('#check-radio input[value="on"]')
    const radioOff = await page.locator('#check-radio input[value="off"]')

    const onOffText = await page.locator('#check-radio strong p')
    expect(await onOffText).toBeVisible()
    expect(await onOffText.innerText()).toEqual('ON')

    await radioOff.check()
    expect(await onOffText).toBeVisible()
    expect(await onOffText.innerText()).toEqual('OFF')

    await radioOn.check()
    expect(await onOffText.innerText()).toEqual('ON')
  })

  test('selects a type via the dropdown field and asserts on the selection', async ({ page }) => {
    await page.selectOption('#select select[name="selection-type"]', 'VIP')
    const selectedOption = await page.getByText("You've selected: VIP")
    expect(await selectedOption).toBeVisible()
  })

  test('selects multiple fruits via the dropdown field and asserts on the selection', async ({ page }) => {
    await page.selectOption('#select select[multiple]', ['apple', 'banana', 'cherry'])
    const selectedFruits = await page.getByText("You've selected the following fruits: apple, banana, cherry")
    expect(await selectedFruits).toBeVisible()
  })

  test('uploads a file and asserts the correct file name appears as a paragraph', async ({ page }) => {
    const fileInput = await page.locator('#select-file input[type="file"]')
    await fileInput.setInputFiles('cypress/fixtures/example.json')

    const selectedFile = await page.getByText('The following file has been selected for upload: example.json')
    expect(await selectedFile).toBeVisible()
  })

  test('clicks a button and triggers a request', async ({ page }) => {
    const button = await page.locator('#intercept button')
    await button.click()

    const response = await page.waitForResponse('https://jsonplaceholder.typicode.com/todos/1')
    expect(response.status()).toEqual(200)

    const jsonResponse = await response.json()
    expect(jsonResponse.id).toEqual(1)

    const todoIdParagraph = await page.getByText('TODO ID: ')
    const titleParagraph = await page.getByText('Title: ')
    const completedParagraph = await page.getByText('Completed: ')
    const userIdParagraph = await page.getByText('User ID: ')

    expect(await todoIdParagraph).toBeVisible()
    expect(await titleParagraph).toBeVisible()
    expect(await completedParagraph).toBeVisible()
    expect(await userIdParagraph).toBeVisible()
  })

  test('clicks a button and triggers a stubbed request', async ({ page }) => {
    const responsePromise = page.waitForResponse('**/todos/1')

    await page.route('**/todos/1', route => {
      route.fulfill({
        path: './cypress/fixtures/todo.json'
      })
    })

    const button = await page.locator('#intercept button')
    await button.click()

    const response = await responsePromise
    expect(await response.status()).toEqual(200)

    const todoIdParagraph = await page.getByText('TODO ID: 420')
    const titleParagraph = await page.getByText('Title: Cypress test')
    const completedParagraph = await page.getByText('Completed: true')
    const userIdParagraph = await page.getByText('User ID: 66')

    expect(await todoIdParagraph).toBeVisible()
    expect(await titleParagraph).toBeVisible()
    expect(await completedParagraph).toBeVisible()
    expect(await userIdParagraph).toBeVisible()
  })

  test('clicks a button and simulates an API failure', async ({ page }) => {
    await page.route('**/todos/1', async route => {
      await route.fulfill({
        status: 500,
      })
    })

    const button = await page.locator('#intercept button')
    await button.click()

    const errorMessage = await page.locator('#intercept .error span')
    expect(await errorMessage).toBeVisible()
    expect(await errorMessage.innerText()).toEqual('Oops, something went wrong. Refresh the page and try again.')
  })

  test('clicks a button and simulates a network failure', async ({ page }) => {
    await page.route('**/todos/1', route => route.abort())
    const button = await page.locator('#intercept button')
    await button.click()

    const errorMessage = await page.locator('#intercept .error span')
    expect(await errorMessage).toBeVisible()
    expect(await errorMessage.innerText()).toEqual('Oops, something went wrong. Check your internet connection, refresh the page, and try again.')
  })

  test('makes an HTTP request and asserts on the returned status code', async ({ page }) => {
    const response = await page.request.get('https://jsonplaceholder.typicode.com/todos/1')
    expect(response.status()).toEqual(200)
  })

  times(10, index => {
    test(`selects ${index + 1} out of 10`, async ({ page }) => {
      await page.fill('#input-range input[type="range"]', `${index + 1}`)
      const selectedLevel = await page.getByText(`You're on level: ${index + 1}`)
      expect(await selectedLevel).toBeVisible()
    })
  })

  test('selects a date and asserts the correct date has been displayed', async ({ page }) => {
    await page.fill('#input-date input[type="date"]', '2024-01-16')

    const dateParagraph = await page.locator('#input-date p#date-paragraph')
    expect(await dateParagraph).toBeVisible()
    expect(await dateParagraph.innerText()).toEqual("The date you've selected is: 2024-01-16")
  })

  test('types a password without leaking it, shows it, and hides it again', async ({ page }) => {
    await page.fill('#password-input input[type="password"]', process.env.PASSWORD)

    const showPasswordCheckbox = await page.locator('#password-input input[type="checkbox"]')
    await showPasswordCheckbox.check()

    const textInput = await page.locator('#password-input input[type="text"]')
    expect(await textInput).toBeVisible()
    expect(await textInput.inputValue()).toEqual(process.env.PASSWORD)

    await showPasswordCheckbox.uncheck()
    expect(await textInput).not.toBeVisible()
  })

  test('counts the number of animals in a list', async ({ page }) => {
    const animals = await page.$$('#should-have-length ul li')
    expect(animals.length).toEqual(5)
  })

  test('freezes the browser clock and asserts the frozen date is displayed', async ({ page }) => {
    const dateSection = await page.locator('#date-section #date-section-paragraph')
    expect(await dateSection).toBeVisible()
    expect(await dateSection.innerText()).toEqual('Current date: 1982-04-15')
  })

  test('copies the code, types it, submits it, then asserts on the success message', async ({ page }) => {
    const codeElement = await page.locator('#copy-paste span#timestamp')
    const code = await codeElement.innerText()

    const codeField = await page.locator('#copy-paste input[type="number"]')
    await codeField.fill(code)

    const submitCodeButton = await page.locator('#copy-paste button')
    await submitCodeButton.click()

    const successCodeSubmissionMessage = await page.getByText("Congrats! You've entered the correct code.")
    expect(await successCodeSubmissionMessage).toBeVisible()

    await page.clock.runFor(4000)
    expect(await successCodeSubmissionMessage).not.toBeVisible()
  })

  test('downloads a file, reads it, and asserts on its content', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download')
    const filePath = path.join(__dirname, 'example.txt')

    const downloadLink = await page.getByText('Download a text file').last()
    await downloadLink.click()
    const download = await downloadPromise
    await download.saveAs(`tests/${download.suggestedFilename()}`)

    const fileContent = fs.readFileSync(filePath, 'utf8')

    expect(fileContent).toEqual('Hello, World!')
  })
})
