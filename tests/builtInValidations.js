var expect = require('chai').expect;
var validations = require('../src/builtInValidation');

describe('isDate', function() {
	var isDate = validations.formlessIsDate;
	it('is true for a valid Date instance', function(done) {
		var date = new Date();
		console.log(date);
		var result = isDate(date);
		expect(result).to.be.true;
		done();
	})
	it('is true for a iso date string', function(done) {
		var date = "2016-01-01";
		var result = isDate(date);
		expect(result).to.be.true;
		done();
	})
})