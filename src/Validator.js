var checkTypeIsCorrect = require('./utilities').checkTypeIsCorrect;
var Promise = require('bluebird');

function Validator(name, message, validationFunc) {
  this.name = name;
  this.async = false;
  if(typeof message === 'function') {
    this.validationFunc = message;
  } else if(typeof message === 'string') {
    this.invalidMessage = message;
    this.validationFunc = validationFunc;
  }
}

Validator.prototype.setInvalidMessage = function (invalidMessage) {
  if(invalidMessage === null) {
    this.invalidMessage = null;
    return;
  }

  if(typeof invalidMessage === 'string') {
    this.invalidMessage = invalidMessage;
  }
}

//TODO: Fix validateProp and validatePropToObj

Validator.prototype.validateProp = function() {
  if(!this.async) {
    return this.validationFunc.apply(this, arguments);
  }
  return this.validatePropAsync.apply(this, arguments);
}

Validator.prototype.validatePropToObj = function() {
  var validated;
  if(!this.async) {
    validated = !!this.validationFunc.apply(this, arguments);
    var obj = {name: this.name, passed: validated};
    if(!validated && this.invalidMessage) {
      obj.message = this.invalidMessage;
    }
    return obj;
  }
  return this.validatePropToObjAsync.apply(this, arguments);
}

Validator.prototype.validatePropAsync = function() {
  if(!this.async) throw new Error('This is not an asynchronous validator.');
  var self = this;
  var newArgs = Array.prototype.slice.call(arguments);
  return new Promise(function(resolve, reject) {
    var unwrappedValidationFunc = self.validationFunc(function(err, result) {
      if(err) return reject(err);
      return resolve(result);
    })
    return unwrappedValidationFunc.apply(self, newArgs);
  });
}

Validator.prototype.validatePropToObjAsync = function() {
  if(!this.async) throw new Error('This is not an asynchronous validator.');
  var self = this;
  var newArgs = Array.prototype.slice.call(arguments);
  return new Promise(function(resolve, reject) {
    var unwrappedValidationFunc = self.validationFunc(function(err, result) {
      if(err) return reject(err);
      var obj = {name: self.name, passed: !!result};
      if(!result && self.invalidMessage) {
        obj.message = this.invalidMessage;
      }
      return resolve(obj);
    });
    return unwrappedValidationFunc.apply(self, newArgs);
  });
}

module.exports = Validator;
