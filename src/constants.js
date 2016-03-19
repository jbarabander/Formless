
//Taken from angular source code: https://github.com/angular/angular.js
var ISO_DATE_REGEXP = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
// See valid URLs in RFC3987 (http://tools.ietf.org/html/rfc3987)
var URL_REGEXP = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;
var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;
var DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})$/;
var DATETIMELOCAL_REGEXP = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
var WEEK_REGEXP = /^(\d{4})-W(\d\d)$/;
var MONTH_REGEXP = /^(\d{4})-(\d\d)$/;
var TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;

//combining regexes
var GENERAL_DATE_REGEXP = new RegExp('(' + DATE_REGEXP.source + '|' + ISO_DATE_REGEXP.source + ')');


module.exports = {
	ISO_DATE_REGEXP: ISO_DATE_REGEXP,
	URL_REGEXP: URL_REGEXP,
	EMAIL_REGEXP: EMAIL_REGEXP,
	NUMBER_REGEXP: NUMBER_REGEXP,
	DATE_REGEXP: DATE_REGEXP,
	DATETIMELOCAL_REGEXP: DATETIMELOCAL_REGEXP,
	WEEK_REGEXP: WEEK_REGEXP,
	MONTH_REGEXP: MONTH_REGEXP,
	TIME_REGEXP: TIME_REGEXP,
	GENERAL_DATE_REGEXP: GENERAL_DATE_REGEXP
}