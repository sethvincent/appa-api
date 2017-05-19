var http = require('http')
var app = require('../index')()
var send = require('../send')
var log = app.log

app.on('/', function (req, res, ctx) {
  send(res, 200, { message: 'oh hey friends' })
})

http.createServer(app).listen(3000, function () {
  log.info('server started at http://127.0.0.1:3000')
})
