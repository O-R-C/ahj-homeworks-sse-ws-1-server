// const fs = require('fs')
const HTTP = require('http')
const path = require('path')
const cors = require('@koa/cors')
const koaStatic = require('koa-static')
const { koaBody } = require('koa-body')
const router = require('./routes')
const Koa = require('koa')
const WS = require('ws')

const app = new Koa()
const server = HTTP.createServer(app)

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
  }),
)
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(koaBody({ json: true, text: true, urlencoded: true, multipart: true }))
app.use(router())

const wss = new WS.Server({ server, path: '/chat' })
const users = new Set()
const chat = ['Welcome']

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const { event, payload } = JSON.parse(data)

    eventHandlers[event] && eventHandlers[event](payload, ws)
    console.log('🚀 ~ ws:', ws)
  })

  ws.send(JSON.stringify({ event: 'UsersList', payload: [...users.keys()] }))
  ws.send(JSON.stringify({ event: 'Chat', payload: chat }))
})

const eventHandlers = {
  UserJoin: (payload) => {
    users.add(payload)
  },
  UserLeave: (payload) => {
    users.delete(payload)
  },
  Chat: (payload, wsClient) => {
    chat.push(payload)

    wss.clients.forEach((client) => {
      if (client !== wsClient && client.readyState === WS.OPEN) {
        client.send(payload)
      }
    })
  },
}

app.on('error', (err) => {
  console.error(err)
})

app.on('close', () => {
  wss.close()
})

app.on('exit', () => {
  wss.close()
})

server.listen(3000)
