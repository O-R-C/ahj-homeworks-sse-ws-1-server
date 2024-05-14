/**
 * Class represents chat instance
 *
 * @class Chat
 */
export class Chat {
  /**
   * Internal chat array
   *
   * @private
   * @type {string[]}
   */
  #chat

  /**
   * Constructor
   * @param {string[]} [chat=[]] - initial chat messages
   */
  constructor(chat = []) {
    this.#chat = chat
  }

  /**
   * Push new message to chat
   * @param {string} payload - message to push
   */
  push(payload) {
    this.#chat.push(payload)
  }

  /**
   * Return all chat messages
   * @return {string[]}
   */
  get() {
    return this.#chat
  }

  /**
   * Clear chat
   */
  clear() {
    this.#chat = []
  }
}

module.exports = Chat
