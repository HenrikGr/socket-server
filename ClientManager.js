/**
 * @prettier
 * @copyright (c) 2020 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described and found in the
 * LICENSE file in the root directory of this source tree.
 */

const WebSocketMap = require('./WebSocketMap')

/*
 * These symbols are used to represent properties that should not be part of
 * the public interface. You could also use ES2019 private fields, but those
 * are not yet widely available as of the time of my writing.
 */
//const client = Symbol('client')

/**
 * ClientManager class to handle clients
 *
 * @public
 * @class
 */
class ClientManager extends WebSocketMap {
  constructor() {
    super()
  }

  parseMessage(userId, message) {
    console.log('parseMessage: ' + userId)
    for (let item of super.iterator()) {
      const { key, webSocket } = item
      console.log(`  Socket readyState for user ${key} : ${webSocket.readyState}`)
      if (webSocket.readyState === 1 && key === userId) {
        webSocket.send(`  Parsing user ${key} message`)
      }
    }
  }
  validateSubscription() {}

  subscribe(userId) {}

  sendSubscriptionData() {}

  sendConnectionConfirmation(userId) {
    console.log('sendConnectionConfirmation: ' + userId)
    for (let item of super.iterator()) {
      const { key, webSocket } = item
      console.log(`  Socket readyState for user ${key} : ${webSocket.readyState}`)
      if (webSocket.readyState === 1 && key === userId) {
        webSocket.send(`  Connection established for user ${key}.`)
      }
    }
  }

  sendMessageConfirmation(userId) {
    console.log('sendMessageConfirmation: ' + userId)
    for (let item of super.iterator()) {
      const { key, webSocket } = item
      console.log(`  Socket readyState for user ${key} : ${webSocket.readyState}`)
      if (webSocket.readyState === 1 && key === userId) {
        webSocket.send(`  Message received from user ${key}`)
      }
    }
  }
}

module.exports = ClientManager
