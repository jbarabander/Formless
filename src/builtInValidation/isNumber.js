function isNumber(prop) {
	return numberRegex.test(prop);
}

numberRegex = /^\-?\d*\.?\d+$/;