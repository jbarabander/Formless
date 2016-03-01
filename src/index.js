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
      validationResult[currentKey] = true;
      break;
    }
    if (Array.isArray(currentField)) {
      validatorsAndParams = currentField.map(function (element) {
        return self._parseValidatorObj(element);
      })
      validationResult[currentKey] = testAllValidatorsMap(model[currentKey], validatorsAndParams);
    } else {
      validatorsAndParams = self._parseValidatorObj(currentField);
      validationResult[currentKey] = validatorsAndParams.validator.validatePropToObj(model[currentKey], validatorsAndParams.param);
    }
  }
  return validationResult;
}

// function testAllValidators(value, validatorParamArr) {
//   validatorParamArr.all(function (element) {
//     return element.validator.validateProp(value, element.param);
//   })
// }

function testAllValidatorsMap(value, validatorParamArr) {
  var obj = {invalid: [], valid:[], passed: true};
  validatorParamArr.forEach(function(element) {
    if(!element.validator.validateProp(value, element.param)) {
      obj.invalid.push(element.validator.validatePropToObj(value, element.param));
      if(obj.passed) obj.passed = false;
    } else {
      obj.valid.push(element.validator.validatePropToObj(value, element.param));
    }
  })
  return obj;
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

// FieldList.prototype._parseValidator = function (validator) {
//   var newParam;
//   var newValidator;
//   if (typeof validator === 'string') {
//     if (/\w+\s*\w*=\s*\w+/.test(validator)) {
//       var splitValidatorAndParam = validator.split('=');
//       newParam = splitValidatorAndParam[1];
//       newValidator = this._validatorStore[splitValidatorAndParam[0]];
//     } else {
//       newValidator = this._validatorStore[validator];
//       newParam = null;
//     }
//   // } else if (typeof validator === 'object' && (typeof validator.validator === 'object' || 'function' || 'string')) {
//   //     var validatorsAndParams = this._parseValidator(validator);
//   } else if (typeof validator === 'function') {
//       newValidator = validator;
//       newParam = null;
//   } else {
//       throw new Error('validator fields must be strings, arrays, or functions');
//   }

//   return {validator: newValidator, param: newParam};
// }

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


function Validator(name, message, validationFunc) {
  this.name = name;
  if(typeof message === 'function') {
    this.validationFunc = message;
  } else if(typeof message === 'string') {
    this.errorMessage = message;
    this.validationFunc = validationFunc;
  }
}

Validator.prototype.setErrorMessage = function (errorMessage) {
  if(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

Validator.prototype.validateProp = function (prop, value) {
  return this.validationFunc(prop, value);
}

Validator.prototype.validatePropToObj = function(prop, value) {
  var validated = this.validationFunc(prop, value);
  var obj = {name: this.name, passed: validated};
  if(!validated && this.errorMessage) obj.message = this.errorMessage;
  return obj;
}