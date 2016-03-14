function matchRegex(prop, regex) {
	var regexToTest = regex instanceof RegExp ? regex : new RegExp(regex);
	return regexToTest.test(prop);
}

module.exports = matchRegex;