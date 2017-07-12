/* eslint-disable standard/no-callback-literal */
function chainValidationRules (rules) {
  if (!Array.isArray(rules) || rules.length === 0) {
    return undefined
  }

  if (rules.length === 1) {
    return rules[0]
  }

  const resolveResult = function ({ result, val, param, prev, next, cb }) {
    if (result === true || (result && result.isValid)) {
      if (next.async) {
        next.validator(val, param, cb)
      } else {
        cb({ isValid: next.validator(val, param), message: next.message })
      }
    } else {
      cb({ isValid: false, message: (result && result.message) || prev.message })
    }
  }

  const combineTwo = function (prev, next) {
    if (!prev.async && !next.async) {
      return [prev, next]
    }

    return {
      async: true,
      message: next.message,
      validator: (val, param, cb) => {
        if (prev.async) {
          prev.validator(val, param, result => resolveResult({ result, val, param, prev, next, cb }))
        } else {
          resolveResult({ result: prev.validator(val, param), val, param, prev, next, cb })
        }
      }
    }
  }

  return rules.reduce((prev, next) => combineTwo(prev, next))
}

export default chainValidationRules
