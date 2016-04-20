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

function assignDefaultValidators(validatorFuncCollection) {
  var keys = Object.keys(validatorFuncCollection);
  var validatorObj = {};
  for(var i = 0; i < keys.length; i++) {
    validatorObj[keys[i]] = new Validator(keys[i], validatorFuncCollection[keys[i]]);
  }
  return validatorObj;
}

// function naiveClone(obj) {
//   var newObj;
//   if(obj instanceof Array) {
//     newObj = [];
//   } else if(typeof obj === 'object') {
//     newObj = {}
//   } else {
//     throw new Error('Can only clone an object or array');
//   }
//   //this is a simple version of clone but this is a positive as we don't care about the prototype
//   //we just want the ennumerable properties of the object
//   var keys = Object.keys(obj);
//   for(var i = 0; i < keys.length; i++) {
//     var currentKey = keys[i];
//     var currentProp = obj[keys[i]];
//     if(typeof currentProp === 'object') {
//       newObj[currentKey] = naiveClone
//     }
//   }
// }

module.exports = {
  assignDefaultValidators: assignDefaultValidators,
  isValidMdy: isValidMdy
};

