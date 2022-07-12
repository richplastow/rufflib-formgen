(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.rufflib = global.rufflib || {}, global.rufflib.formulate = global.rufflib.formulate || {}, global.rufflib.formulate.test = factory()));
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  /**
   * Unit tests for rufflib-formulate 0.0.1
   * A RuffLIB library for transforming an object schema into an HTML form.
   * https://richplastow.com/rufflib-formulate
   * @license MIT
   */
  // rufflib-validate/src/formulate.js
  // Assembles the `Formulate` class.

  /* --------------------------------- Import --------------------------------- */
  var VERSION = '0.0.1'; // Formulate.prototype.foo = foo;

  /* ---------------------------------- Tests --------------------------------- */
  // Runs basic Formulate tests.

  function test(expect, Formulate) {
    expect().section('Formulate basics');
    expect("typeof Formulate // in JavaScript, a class is type 'function'", _typeof(Formulate)).toBe('function');
    expect("Formulate.VERSION", Formulate.VERSION).toBe(VERSION);
    expect("typeof new Formulate()", _typeof(new Formulate())).toBe('object');
    expect("new Formulate()", new Formulate()).toHave({
      foo: undefined
    });
  } // rufflib-formulate/src/entry-point-for-tests.js
  // Run each test. You can comment-out some during development, to help focus on
  // individual tests. But make sure all tests are uncommented before committing.


  function formulateTest(expect, Formulate) {
    test(expect, Formulate);
  }

  return formulateTest;

}));
