var expect = require('chai').expect;
var FieldList = require('../src');

describe('FieldList', function() {
	var model = {
		strTest: 'foo',
		numTest: 2,
		arrTest: [1, 'bar', [], {}],
		objTest: {},
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

	modelComparer.register('asyncValidator', function(done) {
		return function(test, fun) {
			setTimeout(function() {
				done(null, true);
			}, 500);
		}
	})
	var validationMessage = 'This string is too short';
	modelComparer.register('messageValidator', validationMessage, function(prop, length) {
			return prop.length >= length;
	});
	var dynamicArrayMessage = 'This element is an array';
	var dynamicNumberMessage = 'This element is a number';
	modelComparer.register('dynamicMessageValidator', function (prop) {
		if (Array.isArray(prop)) {
			return dynamicArrayMessage;
		}
		if (typeof prop === 'number') {
			return dynamicNumberMessage;
		}
		return true;
	});

	modelComparer.register('modelAccessValidator', function(value, model, currentStr) {
		return value === currentStr && model.arrTest[1] === 'bar';
	})

	it('should validate correctly with custom created validators', function(done) {
		var comparisonFields = {
			strTest: [{validator: 'lengthValidator', params: [1, 8]}, {validator: 'testValidator', param: 'foo'}],
			numTest: 'formlessIsNumber',
			arrTest: [{validator: 'lengthValidator', params: [2, 5]}, {validator: 'formlessRequired'}],
			objTest: [{validator: 'formlessRequired'}, {validator: 'formlessStrictEquals', param: {}, message: 'This is not the correct object'}]
		}
		var validationResult = modelComparer.compareSyncOnly(model, comparisonFields);
		expect(validationResult.strTest.passed).to.be.true;
		expect(validationResult.arrTest.passed).to.be.true;
		expect(validationResult.objTest.passed).to.be.false;
		done();
	});

	it('should validate correctly with async validators', function(done) {
		var comparisonFields = {
			strTest: ['asyncValidator']
		};
		modelComparer.compareAsync(model, comparisonFields)
		.then(function(result) {
			expect(result.strTest.passed).to.be.true;
			done();
		})
	})

	it('should validate correctly when it requires model access', function(done) {
		var comparisonFields = {
			strTest: [{validator: 'modelAccessValidator', params: ['foo'], modelAccess: true}]
		}
		var validationResult = modelComparer.compareSyncOnly(model, comparisonFields);
		expect(validationResult.strTest.passed).to.be.true;
		done()
	})
	it('should display message when defined and validation fails', function(done) {
		var comparisonFields = {
			strTest: [{validator: 'messageValidator', params: [4]}]
		}
		var validationResult = modelComparer.compareSyncOnly(model, comparisonFields);
		expect(validationResult.strTest.passed).to.be.false;
		expect(validationResult.strTest.invalid[0].message).to.equal(validationMessage);
		done();
	})
	it('should fail validation and give output of validator as message when string is returned', function (done) {
		var comparisonFields = {
			numTest: 'dynamicMessageValidator',
			arrTest: 'dynamicMessageValidator',
		}
		var validationResult = modelComparer.compareSyncOnly(model, comparisonFields);
		expect(validationResult.numTest.passed).to.be.false;
		expect(validationResult.numTest.invalid[0].message).to.equal(dynamicNumberMessage);
		expect(validationResult.arrTest.passed).to.be.false;
		expect(validationResult.arrTest.invalid[0].message).to.equal(dynamicArrayMessage);
		done();
	})
})
