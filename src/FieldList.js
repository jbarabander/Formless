var Validator = require('./Validator');
var ValidationResponse = require('./ValidationResult');
var builtInValidation = require('./builtInValidation');
var Promise = require('bluebird');

function assignDefaultValidators(validatorFuncCollection) {
  var keys = Object.keys(validatorFuncCollection);
  var validatorObj = {};
  for(var i = 0; i < keys.length; i++) {
    validatorObj[keys[i]] = new Validator(keys[i], validatorFuncCollection[keys[i]]);
  }
  return validatorObj;
}


function FieldList(obj, options) {
  this.fields = obj || {};
  // this._validatorStore = {};
  this._validatorStore = assignDefaultValidators(builtInValidation);
}

FieldList.prototype.setDefaultFields = function(fields) {
  this.fields = fields;
}


FieldList.prototype.compare = function (model, fields, sync) {
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
    } else {
      validatorsAndParams = self._parseValidatorObj(currentField);
    }
    var validationResponse = new ValidationResponse();
    var testedValidators;
    if(sync) {
      testedValidators = validationResponse.testValidators(model[currentKey], validatorsAndParams, model, true);
    } else {
      testedValidators = validationResponse.testValidators(model[currentKey], validatorsAndParams, model);
    }
    validationResult[currentKey] = testedValidators;
  }
  return validationResult;
}

FieldList.prototype.compareAsync = function (model, fields) {
  return Promise.props(this.compare(model, fields));
}

FieldList.prototype.compareSyncOnly = function(model, fields) {
  return this.compare(model, fields, true);
}

FieldList.prototype._parseValidatorObj = function (validationObj) {
  var newParam;
  var newValidator;
  var newObj;
  if(typeof validationObj === 'string') {
    newValidator = this._validatorStore[validationObj];
  } else if(validationObj.validator instanceof Validator || typeof validationObj.validator === 'function') {
    newValidator = validationObj.validator;
  } else if(typeof validationObj.validator === 'string') {
    newValidator = this._validatorStore[validationObj.validator];
  } else {
    throw new Error('validator must be a Validator, string, or function');
  }
  if(!newValidator) throw new Error('Error: validator not found!');

  newParam = validationObj.param ? validationObj.param : null;
  newMessage = validationObj.message ? validationObj.message : null;
  newObj = {validator: newValidator, param: newParam, message: newMessage};

  if(validationObj.params) {
    if(!Array.isArray(validationObj.params)) {
      throw new Error('params must be an array');
    }
    newObj.params = validationObj.params;
  }

  if(validationObj.modelAccess) {
    newObj.modelAccess = true;
  }

  return newObj;
}

FieldList.prototype.register = function (validator, message, validatorFunc, options) {
  var newValidator;
  if (validator instanceof Validator) {
    newValidator = validator;
  }
  else if (typeof validator === 'string') {
    if(typeof message === 'function') {
      newValidator = new Validator(validator, message);
    } else if(typeof message === 'string') {
      newValidator = new Validator(validator, message, validatorFunc);
    }
  }

  if(options && newValidator) {
    if(options.async) {
      newValidator.async = true;
    }
    if(options.modelAccess) {
      newValidator._fullModelAccess = true;
    }
  }

  if(newValidator) {
    try {
      if (typeof newValidator.validationFunc(Function.prototype) === 'function') {
        newValidator.async = true;
      }
    } catch (e) {}
    this._validatorStore[newValidator.name] = newValidator;
    return newValidator;
  }
}

FieldList.prototype.getValidatorFunctions = function() {
  var validationFuncObj = {};
  var keys = Object.keys(this._validatorStore);
  for(var i = 0; i < keys.length; i++) {
    validationFuncObj[keys[i]] = this._validatorStore[keys[i]].validationFunc;
  }

  return validationFuncObj;
}

FieldList.prototype.getValidator = function(name) {
  return this._validatorStore[name];
}

// FieldList.prototype.defaultValidators = assignDefaultValidators(require('./builtInValidation'));

module.exports = FieldList;
