var utilities = {};

// function testAllValidators(value, validatorParamArr) {
//   validatorParamArr.all(function (element) {
//     return element.validator.validateProp(value, element.param);
//   })
// }

function testAllValidators(value, validatorParamArr) {
  var obj = {invalid: [], valid:[], passed: true, failedOn: null};
  validatorParamArr.forEach(function(element) {
    if(!element.validator.validateProp(value, element.param)) {
      obj.invalid.push(element.validator.validatePropToObj(value, element.param));
      if(obj.passed) obj.passed = false;
    } else {
      obj.valid.push(element.validator.validatePropToObj(value, element.param));
    }
  })
  if(obj.invalid.length) obj.failedOn = obj.invalid[0];
  return obj;
}

utilities.testAllValidators = testAllValidators;

module.exports = utilities;

