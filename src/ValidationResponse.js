function ValidationResult(value, validationParamsObj) {
	this.valid = [];
	this.invalid = [];
	this.failedOn = null;
	this.passed = true;
	if(value && validationParamsObj) {
		this.testValidators(value, validationParamsObj);
	}
}

ValidationResult.prototype.testValidators = function(value, validatorParamsObj) {
	var self = this;
	if(typeof validatorParamsObj !== 'object') {
		return;
	}
	var validatorArr = Array.isArray(validatorParamsObj) ? validatorParamsObj : [validatorParamsObj];
	validatorArr.forEach(function(element) {
    	if(!element.validator.validateProp(value, element.param)) {
      		self.invalid.push(element.validator.validatePropToObj(value, element.param));
      		if(self.passed) self.passed = false;
    	} else {
      		self.valid.push(element.validator.validatePropToObj(value, element.param));
    	}
  	})

  	if(this.invalid.length) this.failedOn = this.invalid[0];
}

module.exports = ValidationResult;
