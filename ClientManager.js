/**
 * @prettier
 * @copyright (c) 2020 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described and found in the
 * LICENSE file in the root directory of this source tree.
 */

const SocketMap = require('./SocketMap')

/*
 * These symbols are used to represent properties that should not be part of
 * the public interface. You could also use ES2019 private fields, but those
 * are not yet widely available as of the time of my writing.
 */
const client = Symbol('client')

/**
 * ClientManager class to handle clients
 *
 * @public
 * @class
 */
class ClientManager extends SocketMap {
  constructor () {
    super()
  }

  sendConnectionConfirmation(userId) {
    console.log('sendConnectionConfirmation: ' + userId)
    for (let item of this) {
      const { key, socket } = item
      console.log(`  Socket readyState for user ${key} : ${socket.readyState}`)
      if (socket.readyState === 1 && key === userId) {
        socket.send(`  Connection established for user ${key}.`)
      }
    }
  }

  sendMessageConfirmation(userId) {
    console.log('sendMessageConfirmation: ' + userId)
    for (let item of this) {
      const { key, socket } = item
      console.log(`  Socket readyState for user ${key} : ${socket.readyState}`)
      if (socket.readyState === 1 && key === userId) {
        socket.send(`  Message received from user ${key}`)
      }
    }
  }
}

module.exports = ClientManager
