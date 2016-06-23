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
<script src="/path/to/formless/Formless.js">
```

then you can simply declare a new instance and start to register validators onto it.
```js
var validationService = new Formless();
validationService.register('required', function (value) {
  return value !== undefined && value !== '' && value !== null && !isNaN(value);
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
//validationResults is equal to {foo: {passed: true}, emptyVal: {passed: false}}
```


