// const fs = require('fs')
const path = require('path')
const cors = require('@koa/cors')
const koaStatic = require('koa-static')
const { koaBody } = require('koa-body')

const router = require('./routes')

const Koa = require('koa')
const app = new Koa()

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

app.listen(3000)
