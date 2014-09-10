nslo-middleware - v0.0.0
===
Creates a useful middleware mixin
## Install
### npm
```bash
$ npm install FireNeslo/middleware --save
```
### bower
```bash
$ bower install FireNeslo/middleware --save
```
## Usage
```js
var Middleware = require('..');
Middleware().
	use(function one(req, res, next) {
	  req.one = 1;
	  return next();
	}).
	use(function two(req, res, next) {
	  req.two = 2;
	  return next();
	}).
	use(function three(req, res, next) {
	  req.three = 3;
	  return next();
	}).
	use(function four(req, res, next) {
	  res.log(req);
	}).
	run({}, console);
```
## Test
```bash
$ npm install -g mocha
$ npm test
```
##API

<!-- Start /home/fireneslo/Dropbox/nslo/middleware/index.js -->

## Middleware()

Author: fireneslo@gmail.com

## use(middleware)

### Params: 

* **function** *middleware* - middleware to add to the stack

## run(request, response)

### Params: 

* **object** *request* - object containing request data
* ***** *response* - some response handler

<!-- End /home/fireneslo/Dropbox/nslo/middleware/index.js -->

