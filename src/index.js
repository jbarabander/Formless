function FieldList(obj, options) {
  this.fields = obj;
  this._validatorStore = {};
}
FieldList.prototype.validateModel = function (model) {
  var keys = Object.keys(model);
  var validationResult = {};
  var self = this;
  for (var i = 0; i < keys.length; i++) {
    var validatorsAndParams;
    var currentKey = keys[i];
    var currentField = self.fields[currentKey];
    if (currentField === undefined) {
      validationResult[currentKey] = true;
      break;
    }
    if (Array.isArray(currentField)) {
      validatorsAndParams = currentField.map(function (element) {
        return self._parseValidator(element);
      })
      validationResult[currentKey] = testAllValidators(model[currentKey], validatorsAndParams);
    } else {
      validatorsAndParams = self._parseValidator(currentField);
      validationResult[currentKey] = validatorsAndParams.validator.validateProp(model[currentKey], validatorsAndParams.param);
    }
  }
  return validationResult;
}

function testAllValidators(value, validatorParamArr) {
  validatorParamArr.all(function (element) {
    return element.validator.validateProp(value, element.param);
  })
}

FieldList.prototype._parseValidator = function (validator) {
  var newParam;
  var newValidator;
  if (typeof validator === 'string') {
    if (/\w+\s*\w*=\s*\w+/.test(validator)) {
      var splitValidatorAndParam = validator.split('=');
      newParam = splitValidatorAndParam[0];
      newValidator = this._validatorStore[splitValidatorAndParam[1]];
    } else {
      newValidator = this._validatorStore[validator];
      var newParam = null;
    }

  } else if (typeof this.fields[currentKey] === 'function') {
    newValidator = this.fields[currentKey];
    newParam = null;
  } else {
    throw new Error('validator fields must be strings, arrays, or functions');
  }

  return {validator: newValidator, param: newParam};
}


FieldList.prototype.register = function (validator, validatorFunc) {
  if (validator instanceof Validator) {
    this._validatorStore[validator.name] = validator;
  }
  else if (arguments.length === 2 && typeof validator === 'string') {
    var newValidator = new Validator(validator, validatorFunc);
    this._validatorStore[newValidator.name] = newValidator;
  }
}

function Validator(name, validationFunc) {
  // this.model = model;
  this.validationFunc = validationFunc;
  this.name = name;
}

Validator.prototype.validateProp = function (prop, value) {
  return this.validationFunc(prop, value);
}
