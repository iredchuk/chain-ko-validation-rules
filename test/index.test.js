/* eslint-disable standard/no-callback-literal */
import test from 'tape'
import chainValidationRules from '../index'

test('when pass undefined, returns undefined', t => {
  t.plan(1)
  const actual = chainValidationRules(undefined)
  t.equal(actual, undefined)
})

test('when pass an empty array, returns undefined', t => {
  t.plan(1)
  const actual = chainValidationRules([])
  t.equal(actual, undefined)
})

test('when pass an array containing one async rule, validate with this rule', t => {
  t.plan(2)

  const actual = chainValidationRules([
    {
      async: true,
      validator: (value, param, cb) => cb(value === 0)
    }
  ])

  t.equal('function', typeof actual.validator)

  actual.validator(0, undefined, result => {
    t.equal(result, true)
  })
})

test('when pass an array containing one async rule, invalidate with this rule', t => {
  t.plan(3)

  const actual = chainValidationRules([
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value === 0, message: 'Error message' })
    }
  ])

  t.equal('function', typeof actual.validator)

  actual.validator(1, undefined, result => {
    t.equal(result.isValid, false)
    t.equal(result.message, 'Error message')
  })
})

test('when pass an array containing two async rules, and both rules validate', t => {
  t.plan(2)

  const actual = chainValidationRules([
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 2 === 0, message: 'Message 1' })
    },
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 3 === 0, message: 'Message 2' })
    }
  ])

  t.equal('function', typeof actual.validator)

  actual.validator(6, undefined, result => {
    t.equal(result.isValid, true)
  })
})

test('when pass an array containing two async rules, and first rule invalidates', t => {
  t.plan(3)

  const actual = chainValidationRules([
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 2 === 0, message: 'Message 1' })
    },
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 3 === 0, message: 'Message 2' })
    }
  ])

  t.equal('function', typeof actual.validator)

  actual.validator(3, undefined, result => {
    t.equal(result.isValid, false)
    t.equal(result.message, 'Message 1')
  })
})

test('when pass an array containing two async rules, and second rule invalidates', t => {
  t.plan(3)

  const actual = chainValidationRules([
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 2 === 0, message: 'Message 1' })
    },
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 3 === 0, message: 'Message 2' })
    }
  ])

  t.equal('function', typeof actual.validator)

  actual.validator(4, undefined, result => {
    t.equal(result.isValid, false)
    t.equal(result.message, 'Message 2')
  })
})

test('when pass an array containing async and sync rules, and all rules validate', t => {
  t.plan(2)

  const actual = chainValidationRules([
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 2 === 0, message: 'Message 1' })
    },
    {
      async: false,
      message: 'Message 2',
      validator: value => value % 3 === 0
    },
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 5 === 0, message: 'Message 3' })
    }
  ])

  t.equal('function', typeof actual.validator)

  actual.validator(30, undefined, result => {
    t.equal(result.isValid, true)
  })
})

test('when pass an array containing async and sync rules, and sync rule invalidates', t => {
  t.plan(3)

  const actual = chainValidationRules([
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 2 === 0, message: 'Message 1' })
    },
    {
      async: false,
      message: 'Message 2',
      validator: value => value % 3 === 0
    },
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 5 === 0, message: 'Message 3' })
    }
  ])

  t.equal('function', typeof actual.validator)

  actual.validator(10, undefined, result => {
    t.equal(result.isValid, false)
    t.equal(result.message, 'Message 2')
  })
})

test('when pass an array containing async and sync rules, and last async rule invalidates', t => {
  t.plan(3)

  const actual = chainValidationRules([
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 2 === 0, message: 'Message 1' })
    },
    {
      async: false,
      message: 'Message 2',
      validator: value => value % 3 === 0
    },
    {
      async: true,
      validator: (value, param, cb) => cb({ isValid: value % 5 === 0, message: 'Message 3' })
    }
  ])

  t.equal('function', typeof actual.validator)

  actual.validator(6, undefined, result => {
    t.equal(result.isValid, false)
    t.equal(result.message, 'Message 3')
  })
})
