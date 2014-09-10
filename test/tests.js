var Middleware = require('..');
var expect = require('chai').expect;
var middleware;
var stack;
var error = new Error('thrown');

// middleware
function middle(req, res, next) {
  req.middle = true;
  return next();
}
function ware(req, res, next) {
  req.ware = true;
  return next();
}
function none(req, res, next) {
  req.none = true;
}
function promise(req, res, next) {
  return new Promise(function(resolve) {
    req.promise = true;
    resolve();
  })
}
function throws(req, res, next) {
  throw error;
}
function reject(req, res, next) {
  return next(error);
}
function async(req, res, next) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      try {
        res(req.none).to.be.undefined;
        req.async = true;
        resolve();
      } catch (e){
        reject(e);
      }
      
    },0)
  })
}


describe('Middleware', function(){
  it('should work as a constructor', function() {
    expect(new Middleware()).to.be.an.instanceof(Middleware);
  })
  it('should work as a function', function() {
    expect(Middleware()).to.be.an.instanceof(Middleware);
  })
  it('should work as a mixin', function() {
    var object = {}; Middleware.call(object);
    expect(object.use).to.be.an.instanceof(Function);
    expect(object.run).to.be.an.instanceof(Function);
  })

  beforeEach(function(){
    stack = [];
    middleware = new Middleware(stack);
  });

  describe('#use(middleware)', function(){
    it('should return itself for chaining', function(){
      expect(middleware.use(ware)).to.equal(middleware);
    });
    it('should add ware to stack', function() {
      middleware.use(ware);
      expect(stack.length).to.equal(1);
      expect(stack[0]).to.equal(ware);
    });
  });

  describe('#run(request, response)', function(){
    var request, response;
    beforeEach(function(){
      request = {};
      response = expect;
      middleware
        .use(middle)
        .use(ware);
    });
    it('should return promise', function(){
      expect(middleware.run().then).to.be.an.instanceof(Function);
    });
    it('should run as long as middleware returns next()', function(){
      middleware.use(none).use(promise);
      return middleware.run(request, response).then(function() {
        expect(request.middle).to.be.true;
        expect(request.ware).to.be.true;
        expect(request.none).to.be.true;
        expect(request.promise).to.be.undefined;
      })
    });
    it('should stop on thrown error', function(){
      middleware.use(throws).use(none);
      return middleware.run(request, response).catch(function(e) {
        expect(e).to.equal(error);
        expect(request.middle).to.be.true;
        expect(request.ware).to.be.true;
        expect(request.none).to.be.undefined;
      });
    });
    it('should stop on rejected promise', function(){
      function ready(e) {
        expect(e).to.equal(error);
        expect(request.middle).to.be.true;
        expect(request.ware).to.be.true;
        expect(request.none).to.be.undefined;
      }
      middleware.use(reject).use(none);
      return middleware.run(request, response).then(ready,ready);
    });
    it('should wait for async operation to complete', function(){
      middleware.use(async).use(none);
      return middleware.run(request, response).then(function(e) {
        expect(request.middle).to.be.true;
        expect(request.ware).to.be.true;
        expect(request.async).to.be.true;
        expect(request.none).to.be.true;
      });
    });
  });
});