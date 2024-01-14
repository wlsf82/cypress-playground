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
  })

document.querySelector('#check-radio input[type="radio"][value="on"]')
  .addEventListener('change', event => {
    if (event.target.checked) {
      document.querySelector('#check-radio p').innerText = 'ON'
      document.querySelector('#check-radio p').style.color = 'green'
    }
  })

document.querySelector('#check-radio input[type="radio"][value="off"]')
  .addEventListener('change', event => {
    if (event.target.checked) {
      document.querySelector('#check-radio p').innerText = 'OFF'
      document.querySelector('#check-radio p').style.color = 'red'
    }
  })
