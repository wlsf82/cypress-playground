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
