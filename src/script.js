const subscribeButton = document.getElementById('click')

subscribeButton.addEventListener('click', event => {
  event.preventDefault()

  document.querySelector('#click span#success').style.display = 'block'

  setTimeout(() => {
    document.querySelector('#click span#success').style.display = 'none'
  }, 3000)
}, false)

document.querySelector('#type textarea').addEventListener('change', event => {
  document.getElementById('signature').innerText = event.target.value
}, false)

document.querySelector('#check input[type="checkbox"]')
  .addEventListener('change', event => {
    const signature = document.querySelector('#check textarea').value

    event.target.checked ?
      document.getElementById('signature-triggered-by-check').innerText = signature :
      document.getElementById('signature-triggered-by-check').innerText = ''
  }, false)

document.querySelector('#check-radio input[type="radio"][value="on"]')
  .addEventListener('change', event => {
    if (event.target.checked) {
      document.querySelector('#check-radio p').innerText = 'ON'
      document.querySelector('#check-radio p').style.color = 'green'
    }
  }, false)

document.querySelector('#check-radio input[type="radio"][value="off"]')
  .addEventListener('change', event => {
    if (event.target.checked) {
      document.querySelector('#check-radio p').innerText = 'OFF'
      document.querySelector('#check-radio p').style.color = 'red'
    }
  }, false)

document.querySelector('#select select[name="selection-type"]')
  .addEventListener('change', event => {
    const selectedTypeParagraph = document.querySelector('#select p')
    const selectedValue = event.target.value

    switch (selectedValue) {
      case 'basic':
        selectedTypeParagraph.innerText = `You've selected: ${selectedValue.toUpperCase()}`
        break
      case 'standard':
        selectedTypeParagraph.innerText = `You've selected: ${selectedValue.toUpperCase()}`
        break
      case 'vip':
        selectedTypeParagraph.innerText = `You've selected: ${selectedValue.toUpperCase()}`
        break
      default:
        selectedTypeParagraph.innerText = "You haven't selected a type yet."
    }
  }, false)

document.querySelector('#select select[multiple]')
  .addEventListener('change', event => {
    let selectedOptions = event.target.selectedOptions
    selectedOptions = Array.from(selectedOptions)
    selectedOptions = selectedOptions.map(option => option.value)
    selectedOptions = selectedOptions.join(', ')

    document.querySelector('#select #fruits-paragraph').innerHTML =
    `You've selected the following fruits: <strong>${selectedOptions}</strong>`
  }, false)

document.querySelector('#select-file input[type="file"]')
  .addEventListener('change', event => {
    document.querySelector('#select-file p').innerHTML =
      `The following file has been selected for upload: <strong>${event.target.files[0].name}</strong>`
  }, false)

document.querySelector('#intercept button').addEventListener('click', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const body = await response.json()

  return {
    status: response.status,
    body,
  }
}, false)
