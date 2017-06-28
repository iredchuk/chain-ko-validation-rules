# chain-ko-validation-rules
Chain [knockout.js validation rules](https://github.com/Knockout-Contrib/Knockout-Validation/wiki/Async-Rules) (async and non-async), ensuring their sequential execution.

To be used with [knockout.validation](https://www.npmjs.com/package/knockout.validation) package.

## Usage:

~~~js

import ko from 'knockout';
import koValidation from 'ko.validation';
import chainKoValidationRules from 'chain-ko-validation-rules';

const combinedRule = chainKoValidationRules([
	{
		async: true,
		validator: function(val, otherVal, callback) {
			// validation logic
		},
		message: 'Some validation error message'
	},
	{
		async: true,
		validator: function(val, otherVal, callback) {
			// validation logic
		},
		message: 'Some other validation error message'
	},
	// ... more async or non-async rules
]);

ko.observable().extend({validation: combinedRule});

~~~
