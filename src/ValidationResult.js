function ValidationResult(value, validationParamsObj) {
	this.valid = [];
	this.invalid = [];
	// this.passed = true;
}

ValidationResult.prototype.testValidators = function(value, validatorParamsObj) {
	var self = this;

	self.passed = true;
	self.value = value;
	
	if(typeof validatorParamsObj !== 'object') {
		return;
	}

	var validatorArr = Array.isArray(validatorParamsObj) ? validatorParamsObj : [validatorParamsObj];
	validatorArr.forEach(function(element) {
		var params = element.params ? element.params : [];
		if(element.param !== undefined && element.param !== null) {
			params.unshift(element.param);
		}

    	if(!element.validator.validateProp(value, params)) {
      		self.invalid.push(element.validator.validatePropToObj(value, params, element.message));
      		if(self.passed) self.passed = false;
    	} else {
      		self.valid.push(element.validator.validatePropToObj(value, params));
    	}
  	})

  	return this;
}

ValidationResult.prototype.getFirstFailed = function() {
	return this.invalid[0];
}

ValidationResult.prototype.getLastFailed = function() {
	return this.invalid[this.invalid.length - 1];
}

ValidationResult.prototype.getFirstPassed = function() {
	return this.valid[0];
}

ValidationResult.prototype.getLastPassed = function() {
	return this.valid[this.valid.length - 1];
}

ValidationResult.prototype.getAllErrorMessages = function() {
	return this.invalid.map(function(element) {
		return element.message;
	})
}

module.exports = ValidationResult;
