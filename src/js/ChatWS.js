/**
 * Class represents a WebSockets chat
 *
 * @class ChatWS
 */
export class ChatWS {
  /**
   * WebSocket client
   * @private
   */
  #ws

  /**
   * WebSocket server instance
   * @private
   */
  #wss

  /**
   * Chat messages
   * @private
   */
  #chat

  /**
   * List of user names
   * @private
   */
  #userList

  /**
   * Constructs an instance of ChatWS
   * @param {WS.Server} wsServer - WebSocket server
   * @param {UserList} userList - List of user names
   * @param {Chat} chat - Chat messages
   * @throws {Error} If any of the arguments are missing
   */
  constructor(wsServer, userList, chat) {
    !wsServer && this.#throwError('wsServer is required')
    !userList && this.#throwError('userList is required')
    !chat && this.#throwError('chat is required')

    this.#userList = userList
    this.#wss = wsServer
    this.#chat = chat

    this.#init()
  }

  /**
   * Throws an error if the argument is missing
   * @private
   * @param {string} error - Error message
   */
  #throwError(error) {
    throw new Error(error)
  }

  /**
   * Initializes the WebSocket connection
   * @private
   */
  #init() {
    this.#connect()
  }

  /**
   * Handles a new connection
   * @private
   */
  #connect() {
    this.#wss.on('connection', (ws) => {
      this.#ws = ws
      this.#send('UsersList', this.#userList.users)
      this.#send('Chat', this.#chat.get())

      ws.on('message', (data) => {
        this.#handleData(data)
      })
    })
  }

  /**
   * Sends data to the client
   * @private
   * @param {string} event - Event name
   * @param {*} payload - Payload data
   */
  #send(event, payload) {
    this.#ws.send(JSON.stringify({ event, payload }))
  }

  /**
   * Handles incoming data from the client
   * @private
   * @param {string} data - Incoming data
   */
  #handleData(data) {
    const { event, payload } = JSON.parse(data)
    this.#eventHandlers[event] && this.#eventHandlers[event](payload)
    !this.#eventHandlers[event] && console.error(`Event ${event} not found`)
  }

  /**
   * List of event handlers
   * @private
   */
  #eventHandlers = {
    UserJoin: (userName) => this.#userJoin(userName),
    UserLeave: (userName) => this.#userLeave(userName),
    Chat: (message) => this.#handleChat(message),
  }

  /**
   * Adds a user to the list
   * @private
   * @param {string} userName - User name
   */
  #userJoin(userName) {
    this.#userList.add(userName)
  }

  /**
   * Removes a user from the list
   * @private
   * @param {string} userName - User name
   */
  #userLeave(userName) {
    this.#userList.delete(userName)
  }

  /**
   * Handles a new chat message
   * @private
   * @param {string} message - New chat message
   */
  #handleChat(message) {
    this.#chat.push(message)
    this.#wss.clients.forEach((client) => {
      if (client !== this.#ws && client.readyState === 1) {
        this.#send('Chat', message)
      }
    })
  }
}

module.exports = ChatWS
