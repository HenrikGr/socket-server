;(function() {
  const messages = document.querySelector('#messages')
  const wsButton = document.querySelector('#wsButton')
  const wsSendButton = document.querySelector('#wsSendButton')
  const logout = document.querySelector('#logout')
  const login = document.querySelector('#login')

  function showMessage(message) {
    messages.textContent += `\n${message}`
    messages.scrollTop = messages.scrollHeight
  }

  function clearMessages(message) {
    messages.textContent = `${message}`
    messages.scrollTop = messages.scrollHeight
  }

  function handleResponse(response) {
    return response.ok
      ? response.json().then(data => JSON.stringify(data, null, 2))
      : Promise.reject(new Error('Unexpected response'))
  }

  login.onclick = function() {
    fetch('/login', { method: 'POST', credentials: 'same-origin' })
      .then(handleResponse)
      .then(clearMessages)
      .catch(function(err) {
        showMessage(err.message)
      })
  }

  logout.onclick = function() {
    fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
      .then(handleResponse)
      .then(clearMessages)
      .catch(function(err) {
        showMessage(err.message)
      })
  }

  let ws

  wsButton.onclick = function() {
    if (ws) {
      showMessage('WebSocket connect already exist')
      //ws.onerror = ws.onopen = ws.onclose = null
      //ws.close()
    } else {
      ws = new WebSocket(`ws://${location.host}`)
    }

    ws.onerror = function(event) {
      console.log('event', event)
      showMessage('WebSocket error')
    }

    ws.onmessage = function(event) {
      console.log('event', event)
      showMessage(event.data)
    }

    ws.onopen = function(event) {
      console.log('event', event)
      showMessage('WebSocket connection established')
    }

    ws.onclose = function(event) {
      console.log('event', event)
      showMessage('WebSocket connection closed')
      ws = null
    }
  }

  wsSendButton.onclick = function() {
    if (!ws) {
      showMessage('No WebSocket connection')
      return
    }

    ws.send(JSON.stringify({ subscribe: 'true', db: 'auth', coll: 'clients' }))
    showMessage('WebSocket sending: ' + JSON.stringify({ subscribe: 'true', db: 'auth', coll: 'clients' }))
  }
})()
