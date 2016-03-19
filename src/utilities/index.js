var Validator = require('../Validator');

//Taken and modified slightly from here: http://stackoverflow.com/questions/5774931/javascript-regular-expression-to-validate-date/5775146#5775146
function isValidMdy(s) {
    var day, A = s.split(/\D+/).map(function(itm){
        return parseInt(itm, 10)
    });
    try{
        day = new Date(A[2], A[0]-1, A[1]);
        if(day.getMonth()+1== A[0] && day.getDate()== A[1]) return true;
        throw 'Bad Date Format';
    }
    catch(er){
        return false;
    }

}


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

function assignDefaultValidators(validatorFuncCollection) {
  var keys = Object.keys(validatorFuncCollection);
  var validatorObj = {};
  for(var i = 0; i < keys.length; i++) {
    validatorObj[keys[i]] = new Validator(keys[i], validatorFuncCollection[keys[i]]);
  }
  return validatorObj;
}


module.exports = {
  testAllValidators: testAllValidators,
  assignDefaultValidators: assignDefaultValidators,
  isValidMdy: isValidMdy
};

