var matchRegex = require('./matchRegex');
var EMAIL_REGEXP = require('../constants').EMAIL_REGEXP;

function isEmail(prop) {
	return matchRegex(prop, EMAIL_REGEXP);
}

module.exports = isEmail;