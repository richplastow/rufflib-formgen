/**
 * Demo 1 for rufflib-formulate 0.0.1
 * A RuffLIB library for transforming an object schema into an HTML form.
 * https://richplastow.com/rufflib-formulate
 * @license MIT
 */


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.rufflib = global.rufflib || {}, global.rufflib.formulate = global.rufflib.formulate || {}, global.rufflib.formulate.demo1 = factory()));
})(this, (function () { 'use strict';

    // rufflib-formulate/src/demo-1.js
    // The ‘main’ file for bundling the 1st Formulate demo.
    // Runs ‘Demo 1’.
    function formulateDemo1(Formulate) {
      var $log = document.querySelector('#log');
      var $form0 = document.querySelector('#form-0');
      var $form1 = document.querySelector('#form-1');
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

    return formulateDemo1;

}));
