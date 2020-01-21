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
     * Map to hold userId and associated sockets
     *
     * @private
     * @type {Map<any, any>}
     */
    this[map] = new Map()
  }

  /**
   * Get socket for a user from the map
   *
   * @public
   * @param userId
   * @returns {*}
   */
  getSocket(userId) {
    console.log('getSocket: ' + userId)
    return this[map].get(userId)
  }

  /**
   * Check if socket exist in the map for the user
   *
   * @param userId
   * @returns {boolean | Promise<boolean>}
   */
  hasSocket(userId) {
    console.log('hasSocket: ' + userId)
    return this[map].has(userId)
  }

  /**
   * Store a user's socket in the map
   *
   * @public
   * @param userId
   * @param socket
   */
  setSocket(userId, socket) {
    console.log('setSocket: ' + userId)
    this[map].set(userId, socket)
  }

  /**
   * Delete docket for a user from the map
   *
   * @public
   * @param userId
   */
  deleteSocket(userId) {
    console.log('deleteSocket: ' + userId)
    this[map].delete(userId)
  }

  /**
   * Clear the map containing userIds and associated sockets
   */
  deleteAll() {
    this[map].clear()
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
