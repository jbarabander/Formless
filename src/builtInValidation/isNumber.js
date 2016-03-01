
var numberRegex = /^\-?\d*\.?\d+$/;

function isNumber(prop) {
	return numberRegex.test(prop);
}