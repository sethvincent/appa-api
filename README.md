# appa-api

Quickly create simple HTTP services.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]
[![conduct][conduct]][conduct-url]

[npm-image]: https://img.shields.io/npm/v/appa-api.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/appa-api 
[travis-image]: https://img.shields.io/travis/sethvincent/appa-api.svg?style=flat-square
[travis-url]: https://travis-ci.org/sethvincent/appa-api
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
[conduct]: https://img.shields.io/badge/code%20of%20conduct-contributor%20covenant-green.svg?style=flat-square
[conduct-url]: CONDUCT.md

![appa](https://raw.githubusercontent.com/sethvincent/appa-api/master/appa.jpg)

## Install

Make sure you've got [node installed](http://nodejs.org), then make `appa` a project dependency:

```sh
npm install --save appa
```

## Usage

```js
var http = require('http')
var app = require('appa-api')()
var send = require('appa-api/send')
var log = app.log

app.on('/', function (req, res, context) {
  send({ message: 'oh hey friends' }).pipe(res)
})

http.createServer(app).listen(3000, function () {
  log.info('server started at http://127.0.0.1:3000')
})
```

## Error handling

Any uncaught errors that occur in a request handler will be caught and a `500 Internal server error` response will be sent.

Send error responses using the `appa-api/error` module:

```js
var error = require('appa-api/error')

module.exports = function (req, res, ctx) {
  return error(404, 'Not found').pipe(res)
}
```

Sending an error response does not automatically log the error, so to add that you can do something like:

```js
var error = require('appa-api/error')
var log = require('appa-api/log')()

module.exports = function (req, res, ctx) {
  log.error(req.method, '500', errorStack)
  return error(500, 'Internal server error').pipe(res)
}
```

## Logging

appa uses [pino](https://npmjs.com/pino) for logging. Pass options to pino with `options.log`: `appa({ log: pinoOptions })`.

See [example pino usage](https://github.com/pinojs/pino#usage) and [all pino options](https://github.com/pinojs/pino/blob/master/docs/API.md#pinooptions-stream).

Or disable logging completely by setting `options.log` to `false`: `appa({ log: false })`.

## Documentation
- [API](docs/api.md)
- [Tests](tests/)

### Examples
- [Basic example](examples/basic.js)
- Example [server](examples/server.js) and [client](examples/client.js)

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## Conduct

It is important that this project contributes to a friendly, safe, and welcoming environment for all. Read this project's [code of conduct](CONDUCT.md)

## Changelog

Read about the changes to this project in [CHANGELOG.md](CHANGELOG.md). The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## Contact

- **issues** – Please open issues in the [issues queue](https://github.com/sethvincent/appa-api/issues)
- **twitter** – Have a question? [@sethdvincent](https://twitter.com/sethdvincent)

## License

[ISC](LICENSE.md)
