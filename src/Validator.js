var checkTypeIsCorrect = require('./utilities').checkTypeIsCorrect;
var Promise = require('bluebird');

function Validator(name, message, validationFunc) {
  this.name = name;
  this._fullModelAccess = false;
  this.async = false;
  if(typeof message === 'function') {
    this.validationFunc = message;
  } else if(typeof message === 'string') {
    this.invalidMessage = message;
    this.validationFunc = validationFunc;
  }
}

Validator.prototype._enableModelAccessOnly = function() {
  this._fullModelAccess = true;
}

Validator.prototype._disableModelAccessOnly = function() {
  this._fullModelAccess = false;
}

Validator.prototype.enableModelAccess = function(func) {
  checkTypeIsCorrect(func, 'function');
  this._fullModelAccess = true;
  this.validationFunc = func;
}

Validator.prototype.disableModelAccess = function(func) {
  checkTypeIsCorrect(func, 'function');
  this._fullModelAccess = false;
  this.validationFunc = func;
}


Validator.prototype.getModelAccessStatus = function() {
  return this._fullModelAccess;
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
//Now that I've thought about it more these 2 functions should only take in prop 
//and then should be able to take in as many parameters as they want
// Validator.prototype.validateProp = function (prop, values) {

//   if(!Array.isArray(values)) {
//     return this.validationFunc(prop, values);
//   }

//   var argumentsArr = values.slice();
//   argumentsArr.unshift(prop);
//   return this.validationFunc.apply(this, argumentsArr);
// }

Validator.prototype.validateProp = function() {
  if(!this.async) {
    return this.validationFunc.apply(this, arguments);
  }
  var self = this;
  var newArgs = Array.prototype.slice.call(arguments);
  return new Promise(function(resolve, reject) {
    newArgs[self.validationFunc.length - 1] = function(err, result) {
      if(err) return reject(err);
      return resolve(result);
    };
    self.validationFunc.apply(this, newArgs);
  });
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
  var self = this;
  var newArgs = Array.prototype.slice.call(arguments);
  return new Promise(function(resolve, reject) {
    newArgs[self.validationFunc.length - 1] = function(err, result) {
      if(err) return reject(err);
      validated = result;
      var obj = {name: self.name, passed: validated};
      if(!validated && self.invalidMessage) {
        obj.message = this.invalidMessage;
      }
      return resolve(obj);
    };
  });
}

// Validator.prototype.validatePropToObj = function(prop, values, message) {
//   var validated;
//   if(!Array.isArray(values)) {
//     var validated = !!this.validationFunc(prop, values);
//   } else {
//     var argumentsArr = values.slice();
//     argumentsArr.unshift(prop);
//     validated = this.validationFunc.apply(this, argumentsArr);
//   }

//   var obj = {name: this.name, passed: validated};
//   if(!validated) {
//     if(message && typeof message === 'string') {
//       obj.message = message;
//     } else if(this.invalidMessage) {
//       obj.message = this.invalidMessage;
//     }
//   }
//   return obj;
// }

module.exports = Validator;
