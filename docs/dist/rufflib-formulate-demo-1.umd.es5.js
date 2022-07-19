(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.rufflib = global.rufflib || {}, global.rufflib.formulate = global.rufflib.formulate || {}, global.rufflib.formulate.demo1 = {})));
})(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  /**
   * Demo 1 for rufflib-formulate 0.0.1
   * A RuffLIB library for transforming an object schema into an HTML form.
   * https://richplastow.com/rufflib-formulate
   * @license MIT
   */
  // rufflib-formulate/src/demo-1.js
  // The ‘main’ file for bundling the first Formulate demo.
  // Runs ‘Demo 1’.
  // Note the `= {}`, to avoid "Cannot destructure property '$log' of 'undefined'...".
  function formulateDemo1(Formulate) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        $log = _ref.$log,
        $form0 = _ref.$form0,
        $form1 = _ref.$form1;

    if (!$log || !$form0 || !$form1) throw Error('Missing an element'); // Generate the top form.

    var schema0 = {
      _meta: {
        title: 'Top Form'
      },
      outer: {
        _meta: {
          title: 'Outer'
        },
        a_boolean: Formulate["boolean"](false),
        another_boolean: Formulate["boolean"](true)
      },
      foo: Formulate["boolean"](true)
    };
    var sg0 = new Formulate($form0, 'schema0', schema0);
    $log.innerHTML = "new Formulate($form0, 'schema0', schema0) =>\n\n";
    $log.innerHTML += JSON.stringify(sg0.toObject(), null, 2); // Generate the second form.

    var schema1 = {
      _meta: {
        title: 'Second Form'
      },
      outer: {
        _meta: {
          title: 'Outer'
        },
        foo: Formulate["boolean"](false),
        inner: {
          _meta: {
            title: 'Inner'
          },
          bar: Formulate["boolean"](false),
          baz: Formulate["boolean"](true)
        },
        zub: Formulate["boolean"](false)
      }
    };
    new Formulate($form1, 'schema1', schema1);
  }
  /* ---------------------------------- Tests --------------------------------- */
  // Runs tests on ‘Demo 1’.


  function testDemo1(expect, Formulate) {
    expect.section('Demo 1');
    var et = expect.that; // Basics.

    et("typeof formulateDemo1", _typeof(formulateDemo1)).is('function'); // // Invalid arguments.
    // et(`formulateDemo1()`,
    //     formulateDemo1()).hasError(
    //     `formulateDemo1(): 'Formulate' is not an object`);
  }

  exports.formulateDemo1 = formulateDemo1;
  exports.testDemo1 = testDemo1;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
