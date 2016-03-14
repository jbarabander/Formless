var matchRegex = require('./matchRegex');
var DATE_REGEXP = require('../constants').DATE_REGEXP;

function isDate(prop) {
	return matchRegex(prop, DATE_REGEXP);
}

module.exports = isDate;