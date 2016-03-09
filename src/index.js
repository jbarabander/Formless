var obj = {
	FieldList: require('./FieldList'),
	Validator: require('./Validator')
}

module.exports = obj;

var newField = new obj.FieldList();

newField.register('testing', function(value, param) {
	return value.length < param;
})

newField.register('smesting', function(value, param) {
	return value.length > param;
})

newField.register('jesting', function(value) {
	return value !== '' || value !== undefined || value !== null;
})

console.log(newField.validateModel({'hello': 'hit', 'boo': ''}, {'hello': [{validator:'testing', param: 4}, {validator:'smesting', param: 2}], 'boo': 'jesting'}));