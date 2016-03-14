var matchRegex = require('./matchRegex');
var NUMBER_REGEXP = require('../constants').NUMBER_REGEXP;
// var numberRegex = /^\-?\d*\.?\d+$/;

function isNumber(prop) {
	return matchRegex(prop, NUMBER_REGEXP);
}

module.exports = isNumber;