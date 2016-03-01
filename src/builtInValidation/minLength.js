function minLength(prop, param) {
	if(isNaN(parseInt(param))) {
		return true;
	}
	return parseInt(param) <= prop.length;
}