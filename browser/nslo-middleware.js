!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Middleware=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1])(1)
});
//# sourceMappingURL=nslo-middleware.js.map