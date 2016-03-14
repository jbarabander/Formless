var isNumber = require('./isNumber');

function min(prop, value) {
	return !isNumber(value) || isNumber(prop) && parseFloat(prop) >= parseInt(value);
}

module.exports = min;