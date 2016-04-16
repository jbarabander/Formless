//TODO: finish this validator

// module.exports = function(prop, param) {
// 	if(typeof param !== 'object' || typeof prop !== 'object') {
// 		return false;
// 	}
// 	var propKeys = 

// }

function jsonComparison(prop, param) {
	return JSON.stringify(prop) === JSON.stringify(param);
}

function jsonSortedComparison(prop, param) {
	return JSON.stringify(prop).split('').sort(sortingFunc).join('') === JSON.stringify(param).split('').sort(sortingFunc).join('');
}


function sortingFunc(x, y) {
	if(x < y) return -1;
	if(x > y) return 1;
	if(x === y) return 0;
}