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