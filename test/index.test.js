import test from 'ava';
import chainValidationRules from '../index';

test('when pass undefined, returns undefined', t => {
	const actual = chainValidationRules(undefined);
	t.is(actual, undefined);
});

test('when pass an empty array, returns undefined', t => {
	const actual = chainValidationRules([]);
	t.is(actual, undefined);
});

test.cb('when pass an array containing one async rule, validate with this rule', t => {
	const actual = chainValidationRules([
		{
			async: true,
			validator: (value, param, cb) => cb(value === 0)
		}
	]);

	t.is('function', typeof actual.validator);

	actual.validator(0, undefined, result => {
		t.is(result, true);
		t.end();
	});
});

test.cb('when pass an array containing one async rule, invalidate with this rule', t => {
	const actual = chainValidationRules([
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value === 0, message: 'Error message'})
		}
	]);

	t.is('function', typeof actual.validator);

	actual.validator(1, undefined, result => {
		t.is(result.isValid, false);
		t.is(result.message, 'Error message');
		t.end();
	});
});

test.cb('when pass an array containing two async rules, and both rules validate', t => {
	const actual = chainValidationRules([
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 2 === 0, message: 'Message 1'})
		},
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 3 === 0, message: 'Message 2'})
		}
	]);

	t.is('function', typeof actual.validator);

	actual.validator(6, undefined, result => {
		t.is(result.isValid, true);
		t.end();
	});
});

test.cb('when pass an array containing two async rules, and first rule invalidates', t => {
	const actual = chainValidationRules([
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 2 === 0, message: 'Message 1'})
		},
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 3 === 0, message: 'Message 2'})
		}
	]);

	t.is('function', typeof actual.validator);

	actual.validator(3, undefined, result => {
		t.is(result.isValid, false);
		t.is(result.message, 'Message 1');
		t.end();
	});
});

test.cb('when pass an array containing two async rules, and second rule invalidates', t => {
	const actual = chainValidationRules([
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 2 === 0, message: 'Message 1'})
		},
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 3 === 0, message: 'Message 2'})
		}
	]);

	t.is('function', typeof actual.validator);

	actual.validator(4, undefined, result => {
		t.is(result.isValid, false);
		t.is(result.message, 'Message 2');
		t.end();
	});
});

test.cb('when pass an array containing async and sync rules, and all rules validate', t => {
	const actual = chainValidationRules([
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 2 === 0, message: 'Message 1'})
		},
		{
			async: false,
			message: 'Message 2',
			validator: value => value % 3 === 0
		},
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 5 === 0, message: 'Message 3'})
		}
	]);

	t.is('function', typeof actual.validator);

	actual.validator(30, undefined, result => {
		t.is(result.isValid, true);
		t.end();
	});
});

test.cb('when pass an array containing async and sync rules, and sync rule invalidates', t => {
	const actual = chainValidationRules([
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 2 === 0, message: 'Message 1'})
		},
		{
			async: false,
			message: 'Message 2',
			validator: value => value % 3 === 0
		},
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 5 === 0, message: 'Message 3'})
		}
	]);

	t.is('function', typeof actual.validator);

	actual.validator(10, undefined, result => {
		t.is(result.isValid, false);
		t.is(result.message, 'Message 2');
		t.end();
	});
});

test.cb('when pass an array containing async and sync rules, and last async rule invalidates', t => {
	const actual = chainValidationRules([
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 2 === 0, message: 'Message 1'})
		},
		{
			async: false,
			message: 'Message 2',
			validator: value => value % 3 === 0
		},
		{
			async: true,
			validator: (value, param, cb) => cb({isValid: value % 5 === 0, message: 'Message 3'})
		}
	]);

	t.is('function', typeof actual.validator);

	actual.validator(6, undefined, result => {
		t.is(result.isValid, false);
		t.is(result.message, 'Message 3');
		t.end();
	});
});
