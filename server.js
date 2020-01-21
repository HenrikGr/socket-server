/**
 * @prettier
 * @copyright (c) 2020 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described and found in the
 * LICENSE file in the root directory of this source tree.
 */

const http = require('http')
const session = require('express-session')
const express = require('express')
const uuid = require('uuid')
const WebSocket = require('ws')
const SocketMap = require('./SocketMap')
const cfenv = require('cfenv')
const appEnv = cfenv.getAppEnv()

// Create our Express application
const app = express()

// Serve static resources from build directory
app.use(express.static('./public'))

// We need the same instance of the session parser in express and WebSocket socket-server.
const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
})

/**
 * Session parser
 */
app.use(sessionParser)

/**
 * Create a socket map instance to store user id's and their associated sockets
 * @type {SocketMap}
 */
const socketMap = new SocketMap()

// Simulate login
app.post('/login', function(req, res) {
  // "Log in" user and set userId to session.
  const id = uuid.v4()
  req.session.userId = id
  console.log(`Updating session for user ${req.session.userId}`)
  res.send({ result: 'OK', message: 'Session updated' })
})

/**
 * Simulate log out
 */
app.delete('/logout', function(req, res) {
  const { session } = req
  console.log('Destroy the session for user : ', session.userId)

  if (!session.userId) {
    res.send({ result: 'OK', message: 'user must login first' })
  } else {
    console.log('Destroy the socket if exist : ', session)
    const socket = socketMap.getSocket(session.userId)
    session.destroy(function() {
      if (socket) {
        socket.close()
      } else {
        console.log('There was no socket stored to delete')
      }
    })

    res.send({ result: 'OK', message: 'Session destroyed' })
  }
})

// Create HTTP socket-server by ourselves.
const server = http.createServer(app)

// Create web socket socket-server
const wss = new WebSocket.Server({ clientTracking: false, noServer: true })

/**
 * Handle upgrade event for the http socket-server
 * If session parsed ok, emit a connection event and handle the rest there.
 */
server.on('upgrade', function(req, socket, head) {
  sessionParser(req, {}, () => {
    if (!req.session.userId) {
      console.log('Session did not contain a valid user! - destroying the socket')
      socket.destroy()
      return
    }

    // Call web socket socket-server to handle the upgrade
    wss.handleUpgrade(req, socket, head, function(ws) {
      // Emit a connection event
      wss.emit('connection', ws, req)
    })
  })
})

/**
 * Handle connection event for the web socket socket-server
 * Emitted when the handshake is complete. request is the http GET request sent by the client.
 * Useful for parsing authority headers, cookie headers, and other information.
 */
wss.on('connection', function(socket, req) {
  const userId = req.session.userId
  console.log('Connection request from user: ' + userId)

  // Store the socket for the userId
  socketMap.setSocket(userId, socket)

  socketMap.sendConnectionConfirmation(userId)

  /**
   * Handle incoming web socket messages
   */
  socket.on('message', function(message) {
    socketMap.sendMessageConfirmation(userId)
  })

  /**
   * Handle web socket close event
   */
  socket.on('close', function(code, reason) {
    console.log('Socket closed :', code, reason)
    socketMap.deleteSocket(userId)
  })

  socket.on('error', function(error) {
    console.log('Socket closed :', error)
  })
})

/**
 * Emitted when the socket-server closes. This event depends on the 'close' event of HTTP socket-server only
 * when it is created internally. In all other cases, the event is emitted independently.
 */
wss.on('close', function(error) {
  console.log('Web socket socket-server closed :', error)
})

/**
 * Emitted when an error occurs on the underlying socket-server.
 */
wss.on('error', function(error) {
  console.log('Web socket socket-server error :', error)
})

// Start the http socket-server.
server.listen(appEnv.port, function() {
  console.info('socket-server starting on ' + appEnv.url)
})
