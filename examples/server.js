var http = require('http')
var app = require('../index')()
var send = require('../send')
var error = require('../error')
var log = app.log

app.on('/', function (req, res, ctx) {
  if (req.method === 'POST') {
    return send(res, 200, ctx.body)
  } else if (req.method === 'GET') {
    return send(res, 200, { message: 'oh hey friends' })
  }

  return error(res, 400, 'Method not allowed')
})

http.createServer(app).listen(3000, function () {
  log.info('server started at http://127.0.0.1:3000')
})
