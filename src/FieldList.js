var Validator = require('./Validator');
var ValidationResponse = require('./ValidationResult');
var assignDefaultValidators = require('./utilities').assignDefaultValidators;

function FieldList(obj, options) {
  this.fields = obj || {};
  // this._validatorStore = {};
  this._validatorStore = assignDefaultValidators(require('./builtInValidation'));
}

FieldList.prototype.setDefaultFields = function(fields) {
  this.fields = fields;
}


FieldList.prototype.compare = function (model, fields) {
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
    validationResult[currentKey] = validationResponse.testValidators(model[currentKey], validatorsAndParams, model);
  }
  return validationResult;
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
  
  return newObj;
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
    return newValidator;
  }
}

FieldList.prototype.mixValidators = function(name, message, validatorFunc) {
  var validationFunctions = this.getValidatorFunctions();
  var newValidator;
  if(typeof message === 'function') {
    newValidator = new Validator(name, message.bind(this, validationFunctions));
  } else if(typeof message === 'string') {
    newValidator = new Validator(name, message, validatorFunc.bind(this, validationFunctions))
  }
  if(newValidator) {
    return this.register(newValidator)
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

