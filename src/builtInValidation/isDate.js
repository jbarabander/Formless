var matchRegex = require('./matchRegex');
var constants = require('../constants');
var isValidMdy = require('../utilities').isValidMdy;
var DATE_REGEXP = constants.DATE_REGEXP;
var ISO_DATE_REGEXP = constants.ISO_DATE_REGEXP;
var GENERAL_DATE_REGEXP = constants.GENERAL_DATE_REGEXP;

function isDate(prop) {
	return validateDateInstance(prop) || validateDateString(prop);
}

// function validateDateNumber() {
// 	return typeof 
// }

function validateDateString(prop) {
	// var str = prop.toString();
	return (
		typeof prop === 'string'
		&& (isValidMdy(prop)
		|| matchRegex(prop, GENERAL_DATE_REGEXP))
		);
}
	

function validateDateInstance(prop) {
	return Object.prototype.toString.call(prop) === '[object Date]' && !isNaN(prop.getTime());
}


module.exports = isDate;