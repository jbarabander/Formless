# Formless
Angular-inspired form validation without the html.

## About
Formless is a small library that allows you to perform form validation in a framework-agnostic setting.  One of Angular's most universally loved features is its wonderful form validation system.  Angular makes it incredibly easy for you to validate forms on the fly with its ng-model and validator directives.  However sometimes you would like to validate a form without needing to rely on the actual html.  This is where Formless comes in, a small validation library that makes it easy to do form validation without needing to write an actual html form.  While the benefits might not seem readily apparent at first, you might find that doing things in this manner allows you more flexibility and is also extendable across any front end framework.   

##Installation
```sh
npm install Formless --save
```
or
```sh
bower install Formless --save
```

##Usage

###Basic
Using Formless is simple.  If using webpack/browserify simply require it in like so:
```js
var Formless = require('Formless');
```
otherwise you can include it as a script on your html
```html
<script src="/path/to/formless/Formless.js"></script>
```

then you can simply declare a new instance and start to register validators onto it.
```js
var validationService = new Formless();
validationService.register('required', function (value) {
  return value !== undefined && value !== '' && value !== null && (typeof value !== 'number' || !isNaN(value));
})
```

with those validators registered you can use the compareAsync or compareSyncOnly methods (depending on the nature of your validators) to validate your model.

```js
var model = {
  foo: 'bar', 
  emptyVal: ''
};

var validationSchema = {
  foo: 'required', 
  emptyVal: 'required'
};

var validationResults = validationService.compareSyncOnly(model, validationSchema);
// validationResults is equal to {foo: {passed: true}, emptyVal: {passed: false}}
```

###Validation with parameters
Well that's all fine and dandy but maybe you want to register one validator and then use parameters to determine when a property should pass validation and when it should not.

That's no problem at all.  First register a new validator that takes in the value as its first parameter and then as many additional parameters that you would like to pass to it from the schema afterwards.
```js
validationService.register('minLength', function (value, minChars) {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length >= minChars;
  }
  return true;
});
```
and then in your schema instead of simply passing in the string name for the validator pass in an object with the validator name instead under the validator property and then an array of the parameters you want to pass in the params property of that object.
```js
var model = {foo: 'bar'};
var validationSchema = {
  foo: {validator: 'minLength', params: [4]}
};

var validationResults = validationService.compareSyncOnly(model, validationSchema);
// validationResults is equal to: {foo: {passed: false}}
```

###Asynchronous Validation
Maybe you want to perform some asynchronous validation instead. This is easy with Formless as well.  Rather than registering your validation function directly instead simply register a function which takes a callback as its only argument and returns the validator function you want inside of it - calling that callback when you are finished with the validation.  For example if you were using jQuery to make an ajax call you can set up an asynchronous validator as follows:
```js
validationService.register('asyncValidator', function (done) {
  return function (value) {
    $.ajax('localhost:3000/test/url', {
      method: 'GET',
      success: function (data) {
        done(null, data === value);
      },
      error: function (err) {
        done(err);
      }
    });
  }
});
```
Then rather than compareSync use compareAsync instead when testing your validation.  Keep in mind that this method will return a promise resolving to the results of the validation.
```js
var model = {asyncValueToCheck: 'This is asynchronous'};
var asyncValidationSchema = {
  asyncValueToCheck: 'asyncValidator'
};
validationService
  .compareAsync(model, asyncValidationSchema)
  .then(function (result) {
    // depending on the results of your asynchronous function: result will either be 
    // {foo: {passed: true}} 
    // or
    // {foo: {passed: false}}
  });
```
