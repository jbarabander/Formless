var Promise = require('bluebird');
var assignParams = require('./utilities').assignParams;

function ValidationResult(value, validationParamsObj) {
	this.valid = [];
	this.invalid = [];
	// this.passed = true;
}

ValidationResult.prototype.testValidators = function(value, validatorParamsObj, model) {
	var self = this;
	var async = false;

	self.passed = true;
	self.value = value;
	
	if(typeof validatorParamsObj !== 'object') {
		return;
	}

	var newValidatorArr = [];
	var validatorArr = Array.isArray(validatorParamsObj) ? validatorParamsObj : [validatorParamsObj];
	validatorArr.forEach(function(element) {
		var params = assignParams(element, value);

		if(!async && element.validator.async) {
			async = true;
		}

		newValidatorArr.push(element.validator.validatePropToObj.apply(element.validator, params));
  	})

	if(async) {
		return Promise.all(newValidatorArr)
		.then(function(resultsArr) {
			self._putResultsInRightBuckets(resultsArr);
		})
		.then(function() {
			return self;
		})
	}
	self._putResultsInRightBuckets(newValidatorArr);
	return self;
}

ValidationResult.prototype._putResultsInRightBuckets = function(arr) {
	var self = this;
	arr.forEach(function(validationResult) {
		if(validationResult.passed !== true) {
			self.invalid.push(validationResult);
			if(self.passed) {
				self.passed = false;
			}
		} else {
			self.valid.push(validationResult);
		}
	})
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
	var errorsArr = [];
	this.invalid.reduce(function(prev, curr) {
		if(curr.message) {
			prev.push(curr.message);
		}
	}, errorsArr);
	return errorsArr;
}

module.exports = ValidationResult;
