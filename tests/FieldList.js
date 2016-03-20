var expect = require('chai').expect;
var FieldList = require('../src').FieldList;

describe('FieldList', function() {
	var model = {
		strTest: 'foo',
		numTest: 2,
		arrTest: [1, 'bar', [], {}],
		objTest: {}
	}
	var modelComparer = new FieldList();
	modelComparer.register('testValidator', function(prop, value) {
		return prop === value;
	})

	modelComparer.register('lengthValidator', function(prop, minLength, maxLength) {
		if(prop.length === undefined) {
			return true;
		} 
		return minLength < prop.length && prop.length < maxLength;
	})

	it('should validate correctly with custom created validators', function(done) {
		var comparisonFields = {
			strTest: [{validator: 'lengthValidator', params: [1, 8]}, {validator: 'testValidator', param: 'foo'}]
		}
		var validationResult = modelComparer.validateModel(model, comparisonFields);
		console.dir(validationResult.strTest.valid);
		expect(validationResult.strTest.passed).to.be.true;
		done();
	});
})