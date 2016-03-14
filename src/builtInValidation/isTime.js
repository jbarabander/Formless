var matchRegex = require('./matchRegex');
var TIME_REGEXP = require('../constants').TIME_REGEXP;

function isTime(prop) {
	return matchRegex(prop, TIME_REGEXP);
}

module.exports = isTime;