var checkTypeIsCorrect = require('./utilities').checkTypeIsCorrect;
var Promise = require('bluebird');

function Validator(name, message, validationFunc) {
  this.name = name;
  this.async = false;
  var self = this;
  Object.defineProperty(this, 'validationFunc', {
    get: function () {
      return this.__validationFunc;
    },
    set: function (value) {
      if (typeof value !== 'function') {
        return;
      }
      self.__validationFunc = value;
      try {
        if (typeof value(Function.prototype) === 'function') {
          self.async = true;
        }
      } catch (e) {}
    }
  })
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
    validationResult = this.validationFunc.apply(this, arguments);
    return this.createValidatorResultObj(validationResult);
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
      var validationResultObj = self.createValidatorResultObj(result);
      return resolve(validationResultObj);
    });
    return unwrappedValidationFunc.apply(self, newArgs);
  });
}

Validator.prototype.createValidatorResultObj = function(result) {
  var obj = {name: this.name};
  var resultIsString = typeof result === 'string';
  obj.passed = resultIsString ? false : !!result;
  var errorMessage = resultIsString ? result : this.invalidMessage;
  if (!obj.passed && errorMessage) {
    obj.message = errorMessage;
  }
  return obj;
}

module.exports = Validator;
