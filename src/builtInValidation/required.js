function required(model) {
	// if(Array.isArray(model)) {
	// 	return model.length !== 0;
	// }
	return model !== '' && model !== undefined && model !== null;
}

module.exports = required;
