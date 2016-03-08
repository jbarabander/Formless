var Validator = require('./Validator');
var testAllValidators = require('./utilities').testAllValidators;

function FieldList(obj, options) {
  this.fields = obj || {};
  this._validatorStore = {};
}

FieldList.prototype.setDefaultFields = function(fields) {
  this.fields = fields;
}


FieldList.prototype.validateModel = function (model, fields) {
  var keys = Object.keys(model);
  var validationResult = {};
  var self = this;
  for (var i = 0; i < keys.length; i++) {
    var validatorsAndParams;
    var currentKey = keys[i];
    var currentField = fields ? fields[currentKey] : self.fields[currentKey];
    if (currentField === undefined) {
      validationResult[currentKey] = {passed: true};
      continue;
    }
    if (Array.isArray(currentField)) {
      validatorsAndParams = currentField.map(function (element) {
        return self._parseValidatorObj(element);
      })
      validationResult[currentKey] = testAllValidators(model[currentKey], validatorsAndParams);
    } else {
      validatorsAndParams = self._parseValidatorObj(currentField);
      validationResult[currentKey] = validatorsAndParams.validator.validatePropToObj(model[currentKey], validatorsAndParams.param);
    }
  }
  return validationResult;
}

FieldList.prototype._parseValidatorObj = function (validationObj) {
  var newParam;
  var newValidator;

  if(validationObj.validator instanceof Validator || typeof validationObj.validator === 'function') {
    newValidator = validationObj.validator;
  } else if(typeof validationObj.validator === 'string') {
    newValidator = this._validatorStore[validationObj.validator];
  } else {
    throw new Error('validator must either be instance of Validator, or must be string or function');
  }
  newParam = validationObj.param ? validationObj.param : null;
  return {validator: newValidator, param: newParam};
}

FieldList.prototype.register = function (validator, message, validatorFunc) {
  var newValidator;
  if (validator instanceof Validator) {
    newValidator = validator;
  }
  // else if (arguments.length === 2 typeof validator === 'string') {
  else if (typeof validator === 'string') {
    if(typeof message === 'function') {
      newValidator = new Validator(validator, message);
    } else if(typeof message === 'string') {
      newValidator = new Validator(validator, message, validatorFunc);
    }
    // if(arguments.length === 2)
    // newValidator = new Validator(validator, validatorFunc);
  } 
  // else if (typeof validator === 'function' && validator.name !== undefined) {
  //   newValidator = new Validator(validator.name, validator);
  //   if(arguments.length === 2 && typeof message === 'string') {
  //    newValidator.setErrorMessage(message); 
  //   }
  // }

  if(newValidator) {
    this._validatorStore[newValidator.name] = newValidator;
  }
}

FieldList.prototype.getValidator = function(name) {
  return this._validatorStore[name];
}

module.exports = FieldList;

