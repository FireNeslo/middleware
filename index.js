function resolve(error) {'use strict';
	return error ? Promise.reject(error) : Promise.resolve();
}
/**
 * @module nslo-middleware
 * @author fireneslo@gmail.com
 * @description Creates extendable use chain
 */
function Middleware(stack) {'use strict';
	if(!this)  return new Middleware(stack);
	if(!stack) stack = [];
	/**
	 * @description Add middleware to stack
	 * @param {function} middleware - middleware to add to the stack
	 */
	this.use = function use(middleware) {
		return stack.push(middleware), this;
	};
	/**
	 * @description Run stack
	 * @param {object} request  - object containing request data
	 * @param {*}      response - some response handler
	 */
	this.run = function run(request, response) {
		var finished = false;
		function done(value) {
			return value || (finished = true);
		}
		function next(promise, callback) {
			return promise.then(function() {
				if(finished) {return;}
				return done(callback(request, response, resolve));
			});
		}
		return stack.reduce(next, resolve()).then(function() {
			return request;
		});
	};
}
module.exports = Middleware;