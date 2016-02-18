function FieldList(json) {
	this.fields;
	this._validatorStore = {};
}
FieldList.prototype.validateModel = function(model) {

}

function Validator(name, validationFunc) {
	// this.model = model;
	this.validationFunc = validationFunc
	this.name = name;
}

Validator.prototype.register = function(validator, validatorFunc) {
	if(arguments.length === 2) {
		var newValidator = new Validator(validator, validatorFunc)
		this._validatorStore[newValidator.name] = newValidator;
	} else if(arguments.length === 1 && newValidator instanceof Validator) {
		this._validatorStore[validator.name] = validator;
	}
}

Validator.prototype.validateProp(prop) {
	return this.validationFunc(prop);
}

function validateModel(model, fieldList) {

}

// function validateProp(prop, validator) {

// }