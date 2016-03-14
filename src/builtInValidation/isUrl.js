var matchRegex = require('./matchRegex');
var URL_REGEXP = require('../constants').URL_REGEXP;

function isUrl(prop) {
	return matchRegex(prop, URL_REGEXP);
}

module.exports = isUrl;