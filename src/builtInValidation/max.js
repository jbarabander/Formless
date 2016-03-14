var isNumber = require('./isNumber');

function max(prop, value) {
	return !isNumber(value) || isNumber(prop) && parseFloat(prop) <= parseInt(value);
}

module.exports = max;