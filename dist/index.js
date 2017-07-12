"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable standard/no-callback-literal */
function chainValidationRules(rules) {
  if (!Array.isArray(rules) || rules.length === 0) {
    return undefined;
  }

  if (rules.length === 1) {
    return rules[0];
  }

  var resolveResult = function resolveResult(_ref) {
    var result = _ref.result,
        val = _ref.val,
        param = _ref.param,
        prev = _ref.prev,
        next = _ref.next,
        cb = _ref.cb;

    if (result === true || result && result.isValid) {
      if (next.async) {
        next.validator(val, param, cb);
      } else {
        cb({ isValid: next.validator(val, param), message: next.message });
      }
    } else {
      cb({ isValid: false, message: result && result.message || prev.message });
    }
  };

  var combineTwo = function combineTwo(prev, next) {
    if (!prev.async && !next.async) {
      return [prev, next];
    }

    return {
      async: true,
      message: next.message,
      validator: function validator(val, param, cb) {
        if (prev.async) {
          prev.validator(val, param, function (result) {
            return resolveResult({ result: result, val: val, param: param, prev: prev, next: next, cb: cb });
          });
        } else {
          resolveResult({ result: prev.validator(val, param), val: val, param: param, prev: prev, next: next, cb: cb });
        }
      }
    };
  };

  return rules.reduce(function (prev, next) {
    return combineTwo(prev, next);
  });
}

exports.default = chainValidationRules;