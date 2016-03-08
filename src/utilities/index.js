var utilities = {};

// function testAllValidators(value, validatorParamArr) {
//   validatorParamArr.all(function (element) {
//     return element.validator.validateProp(value, element.param);
//   })
// }

function testAllValidatorsMap(value, validatorParamArr) {
  var obj = {invalid: [], valid:[], passed: true};
  validatorParamArr.forEach(function(element) {
    if(!element.validator.validateProp(value, element.param)) {
      obj.invalid.push(element.validator.validatePropToObj(value, element.param));
      if(obj.passed) obj.passed = false;
    } else {
      obj.valid.push(element.validator.validatePropToObj(value, element.param));
    }
  })
  return obj;
}

utilities.testAllValidatorsMap = testAllValidatorsMap;

module.exports = utilities;

