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

module.exports = Validator;