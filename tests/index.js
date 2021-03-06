var test = require('tape')
var http = require('http')
var request = require('request')
var intoStream = require('into-stream')

var createApp = require('../index')
var send = require('../send')

function createServer (app) {
  return http.createServer(app)
}

test('create a server', function (t) {
  var app = createApp({ log: false })
  var server = createServer(app).listen(0, function () {
    t.ok(app)
    server.close()
    t.end()
  })
})

test('create a route', function (t) {
  t.plan(6)
  var app = createApp({ log: false })

  app.on('/', function (req, res, context) {
    t.ok(req)
    t.ok(res)
    t.ok(context)
    send(res, { hello: 'hi' })
  })

  var server = createServer(app).listen(3131, function () {
    request({ url: 'http://127.0.0.1:3131', json: true }, function (err, res, body) {
      t.notOk(err)
      t.ok(body)
      t.equal(body.hello, 'hi')
      server.close()
    })
  })
})

test('querystring is parsed', function (t) {
  t.plan(4)
  var app = createApp({ log: { level: 'silent' } })

  app.on('/', function (req, res, context) {
    send(res, context.query)
  })

  var server = createServer(app).listen(3131, function () {
    request({ url: 'http://127.0.0.1:3131?hi=hello&hey[wut]=wat', json: true }, function (err, res, body) {
      t.notOk(err)
      t.ok(body)
      t.equal(body.hi, 'hello')
      t.equal(body.hey.wut, 'wat')
      server.close()
    })
  })
})

test('send a stream', function (t) {
  t.plan(4)
  var app = createApp({ log: false })

  app.on('/', function (req, res, context) {
    var stream = intoStream.obj(context.query)
    send(res, stream)
  })

  var server = createServer(app).listen(3131, function () {
    request({ url: 'http://127.0.0.1:3131?hi=hello&hey[wut]=wat', json: true }, function (err, res, body) {
      t.notOk(err)
      t.ok(body)
      t.equal(body.hi, 'hello')
      t.equal(body.hey.wut, 'wat')
      server.close()
    })
  })
})

test('receive params', function (t) {
  t.plan(7)
  var app = createApp({ log: false })

  app.on('/list/:listkey/item/:itemkey', function (req, res, ctx) {
    t.ok(ctx.params)
    t.ok(ctx.params.listkey)
    t.ok(ctx.params.itemkey)
    send(res, ctx.params)
  })

  var server = createServer(app).listen(3131, function () {
    request({ url: 'http://127.0.0.1:3131/list/hello/item/wat', json: true }, function (err, res, body) {
      t.notOk(err)
      t.ok(body)
      t.equal(body.listkey, 'hello')
      t.equal(body.itemkey, 'wat')
      server.close()
    })
  })
})

test('handle internal errors', function (t) {
  t.plan(4)
  var app = createApp({ log: false })

  app.on('/error', function (req, res, ctx) {
    throw new Error('oops')
  })

  var server = createServer(app).listen(3131, function () {
    request({ url: 'http://127.0.0.1:3131/error', json: true }, function (err, res, body) {
      t.notOk(err)
      t.equal(res.statusCode, 500)
      t.equal(body.statusCode, 500)
      t.equal(body.message, 'Internal server error')
      server.close()
    })
  })
})
