var Validator = require('../Validator');

//Taken and modified slightly from here: http://stackoverflow.com/questions/5774931/javascript-regular-expression-to-validate-date/5775146#5775146
function isValidMdy(s) {
    var day, A = s.split(/\D+/).map(function(itm){
        return parseInt(itm, 10)
    });
    try {
        day = new Date(A[2], A[0]-1, A[1]);
        if(day.getMonth()+1== A[0] && day.getDate()== A[1]) return true;
        throw 'Bad Date Format';
    }
    catch(err) {
        return false;
    }

}

function assignDefaultValidators(validatorFuncCollection) {
  var keys = Object.keys(validatorFuncCollection);
  var validatorObj = {};
  for(var i = 0; i < keys.length; i++) {
    validatorObj[keys[i]] = new Validator(keys[i], validatorFuncCollection[keys[i]]);
  }
  return validatorObj;
}

function checkTypeIsCorrect(arg, type) {
  var argType = typeof arg;
  if(argType !== type) {
    throw new Error('Expected ' + type + ' but got ' + argType);
  }
}

function assignParams(element, value, model) {
  var params = element.params ? element.params : [];
    if(element.param !== undefined && element.param !== null) {
      params.unshift(element.param);
    }
    if(element.validator.getModelAccessStatus()) {
      params.unshift(model);
    }
    params.unshift(value);
    return params;
}

module.exports = {
  assignDefaultValidators: assignDefaultValidators,
  isValidMdy: isValidMdy,
  checkTypeIsCorrect: checkTypeIsCorrect,
  assignParams: assignParams
};
