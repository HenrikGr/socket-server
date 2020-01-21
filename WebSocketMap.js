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
 * WebSocketMap class to store user id(s) and associated webSockets
 *
 * @public
 * @class
 */
class WebSocketMap {
  /**
   * Create a webSocket map instance
   */
  constructor() {
    /**
     * Map to hold userId and associated webSockets
     *
     * @private
     * @type {Map<string, socket>}
     */
    this[map] = new Map()
  }

  /**
   * Get webSocket for a user from the map
   *
   * @public
   * @param {string} userId - id of the user
   * @returns {socket|undefined}
   */
  getWebSocket(userId) {
    console.log('getSocket: ' + userId)
    return this[map].get(userId)
  }

  /**
   * Check if user has an associated webSocket
   *
   * @param {string} userId - id of the user
   * @returns {boolean}
   */
  hasWebSocket(userId) {
    console.log('hasSocket: ' + userId)
    return this[map].has(userId)
  }

  /**
   * Store a user's webSocket in the map
   *
   * @public
   * @param {string} userId - id of the user
   * @param {socket} webSocket - the associated socket
   */
  setWebSocket(userId, webSocket) {
    console.log('setSocket: ' + userId)
    this[map].set(userId, webSocket)
  }

  /**
   * Delete the associated webSocket
   *
   * @public
   * @param {string} userId - id of the user
   */
  deleteWebSocket(userId) {
    console.log('deleteSocket: ' + userId)
    this[map].delete(userId)
  }

  /**
   * Clear the map containing userIds and associated webSockets
   */
  deleteAll() {
    this[map].clear()
  }

  /**
   * The default iterator for the class.
   *
   * @interface iterator protocol
   * @returns {Iterator} The default iterator for the class.
   */
  [Symbol.iterator]() {
    return this.iterator()
  }

  /**
   * Create an iterator that returns each item in the map.
   *
   * @returns {Iterator} An iterator on the map.
   */
  *iterator() {
    for (let [key, value] of this[map]) {
      yield { key: key, webSocket: value }
    }
  }
}

module.exports = WebSocketMap
