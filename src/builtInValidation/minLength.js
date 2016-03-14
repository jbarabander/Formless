function minLength(prop, param) {
	var intParam = parseInt(param, 10);
	if(isNaN(intParam)) {
		return true;
	}
	return intParam <= prop.length;
}

module.exports = minLength;