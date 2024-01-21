document.querySelector('#click button').addEventListener('click', event => {
  event.preventDefault()

  document.querySelector('#click span#success').style.display = 'block'

  setTimeout(() => {
    document.querySelector('#click span#success').style.display = 'none'
  }, 3000)
}, false)

document.querySelector('#type textarea').addEventListener('input', event => {
  document.getElementById('signature').innerText = event.target.value
  document.getElementById('signature').style.textDecoration = 'underline'
}, false)

document.querySelector('#check input[type="checkbox"]')
  .addEventListener('change', event => {
    const signature = document.querySelector('#check textarea').value

    if (event.target.checked) {
      document.getElementById('signature-triggered-by-check').innerText = signature
      document.getElementById('signature-triggered-by-check')
        .style
        .textDecoration = 'underline'
    } else {
      document.getElementById('signature-triggered-by-check').innerText = ''
      document.getElementById('signature-triggered-by-check')
        .style
        .textDecoration = 'none'
    }
  }, false)

document.querySelector('#check-radio input[type="radio"][value="on"]')
  .addEventListener('change', event => {
    if (event.target.checked) {
      document.querySelector('#check-radio p#on-off').innerText = 'ON'
      document.querySelector('#check-radio p#on-off').style.color = 'green'
    }
  }, false)

document.querySelector('#check-radio input[type="radio"][value="off"]')
  .addEventListener('change', event => {
    if (event.target.checked) {
      document.querySelector('#check-radio p#on-off').innerText = 'OFF'
      document.querySelector('#check-radio p#on-off').style.color = 'red'
    }
  }, false)

document.querySelector('#select select[name="selection-type"]')
  .addEventListener('change', event => {
    const selectedTypeParagraph = document.querySelector('#select p#select-selection')
    const selectedValue = event.target.value

    switch (selectedValue) {
      case 'basic':
        selectedTypeParagraph.innerHTML = `You've selected: <strong>${selectedValue.toUpperCase()}</strong>`
        break
      case 'standard':
        selectedTypeParagraph.innerHTML = `You've selected: <strong>${selectedValue.toUpperCase()}</strong>`
        break
      case 'vip':
        selectedTypeParagraph.innerHTML = `You've selected: <strong>${selectedValue.toUpperCase()}</strong>`
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
    document.querySelector('#select-file p#file').innerHTML =
      `The following file has been selected for upload: <strong>${event.target.files[0].name}</strong>`
  }, false)

document.querySelector('#intercept button')
  .addEventListener('click', mountTodoList, false)

async function mountTodoList() {
  const interceptDiv = document.getElementById('intercept')
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(async response => {
      if (response.ok) {
        const body = await response.json()
        const { completed, id, title, userId } = body

        const unorderedList = document.createElement('ul')
        const completedListItem = document.createElement('li')
        const idListItem = document.createElement('li')
        const titleListItem = document.createElement('li')
        const userIdListItem = document.createElement('li')

        idListItem.innerText = `TODO ID: ${id}`
        titleListItem.innerText = `Title: ${title}`
        completedListItem.innerText = `Completed: ${completed}`
        userIdListItem.innerText = `User ID: ${userId}`

        interceptDiv.appendChild(unorderedList)
        document.querySelector('#intercept ul').appendChild(idListItem)
        document.querySelector('#intercept ul').appendChild(titleListItem)
        document.querySelector('#intercept ul').appendChild(completedListItem)
        document.querySelector('#intercept ul').appendChild(userIdListItem)

        document.querySelector('#intercept button')
          .removeEventListener('click', mountTodoList)

        return {
          status: response.status,
          body,
        }
      } else {
        const errorDiv = document.createElement('div')
        const errorSpan = document.createElement('span')

        errorDiv.className = 'error'
        errorSpan.innerText = 'Oops, something went wrong. Refresh the page and try again.'
        interceptDiv.appendChild(errorDiv)
        errorDiv.appendChild(errorSpan)

        document.querySelector('#intercept button')
          .removeEventListener('click', mountTodoList)
      }
    })
  } catch {
    const errorDiv = document.createElement('div')
    const errorSpan = document.createElement('span')

    errorDiv.className = 'error'
    errorSpan.innerText = 'Oops, something went wrong. Check your internet connection, refresh the page, and try again.'
    interceptDiv.appendChild(errorDiv)
    errorDiv.appendChild(errorSpan)

    document.querySelector('#intercept button')
      .removeEventListener('click', mountTodoList)
  }
}

document.querySelector('#input-range input[type="range"]')
  .addEventListener('change', event => {
    document.querySelector('#input-range p#level-paragraph')
      .innerHTML = `You're on level: <strong>${event.target.value}</strong>`
  }, false)

document.querySelector('#input-date input[type="date"]')
  .addEventListener('change', event => {
    document.querySelector('#input-date p#date-paragraph')
      .innerHTML = `The date you've selected is: <strong>${event.target.value}</strong>`
  }, false)

document.querySelector('#password-input input[type="checkbox"]')
  .addEventListener('change', event => {
    event.target.checked ?
      document.querySelector('#password-input input[type="password"]').type = 'text' :
      document.querySelector('#password-input input[type="text"]').type = 'password'
  }, false)

window.onload = () => {
  const d = new Date()
  const timestamp = d.getTime()
  const formatedTimestamp = ()=> {
    const date = d.toISOString().split('T')[0]
    return date
  }

  document.querySelector('#date-section #date-section-paragraph')
    .innerHTML = `Date: <strong>${formatedTimestamp()}</strong>`

  document.querySelector('#copy-paste span#timestamp').innerText = timestamp

  document.querySelector('#copy-paste button').addEventListener('click', event => {
    event.preventDefault()

    const typedCode = document.querySelector('#copy-paste input#code').value
    const actualCode = document.querySelector('#copy-paste span#timestamp').innerText

    if (typedCode === actualCode) {
      document.querySelector('#copy-paste .success').style.display = 'block'
      document.querySelector('#copy-paste input#code').value = ''
      setTimeout(() => {
        document.querySelector('#copy-paste .success').style.display = 'none'
      }, 3000)
    } else {
      document.querySelector('#copy-paste .error').style.display = 'block'
      setTimeout(() => {
        document.querySelector('#copy-paste .error').style.display = 'none'
      }, 3000)
    }
  })
}
