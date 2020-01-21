/**
 * @prettier
 * @copyright (c) 2020 - present, HGC-AB
 * @licence This source code is licensed under the MIT license described and found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * These symbols are used to represent properties that should not be part of
 * the public interface. You could also use ES2019 private fields, but those
 * are not yet widely available as of the time of my writing.
 */
const map = Symbol('map')

/**
 * SocketMap class to store a map of user id(s) and sockets
 *
 * @public
 * @class
 */
class SocketMap {
  /**
   * Create a socket map instance
   */
  constructor() {
    /**
     * Map to hold userId and their sockets
     *
     * @private
     * @type {Map<any, any>}
     */
    this[map] = new Map()
  }

  /**
   * Get socket for a user
   *
   * @public
   * @param userId
   * @returns {*}
   */
  getSocket(userId) {
    console.log('getSocket: Socket retrieved for user: ' + userId)
    return this[map].get(userId)
  }

  /**
   * Store a user's socket
   *
   * @public
   * @param userId
   * @param socket
   */
  setSocket(userId, socket) {
    console.log('setSocket: Socket set for user: ' + userId)
    this[map].set(userId, socket)
  }

  /**
   * Delete docket for a user
   *
   * @public
   * @param userId
   */
  deleteSocket(userId) {
    console.log('deleteSocket: Socket deleted for user: ' + userId)
    this[map].delete(userId)
  }

  sendConnectionConfirmation(userId) {
    console.log('sendConnectionConfirmation - user: ' + userId)
    for (let item of this) {
      const { key, socket } = item
      if (socket.readyState === 1 && key === userId) {
        socket.send(`Connection established for user ${key}.`)
      }
    }
  }

  sendMessageConfirmation(userId) {
    console.log('sendMessageConfirmation - user: ' + userId)
    for (let item of this) {
      const { key, socket } = item
      if (socket.readyState === 1 && key === userId) {
        socket.send(`Message received from user ${key}`)
      }
    }
  }

  /**
   * The default iterator for the class.
   * @returns {Iterator} An iterator for the class.
   */
  [Symbol.iterator]() {
    return this.iterator()
  }

  /**
   * Create an iterator that returns each node's data in the list.
   * @returns {Iterator} An iterator on the list.
   */
  *iterator() {
    for (let [key, value] of this[map]) {
      yield { key: key, socket: value }
    }
  }
}

module.exports = SocketMap
