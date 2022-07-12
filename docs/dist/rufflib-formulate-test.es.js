/**
 * Unit tests for rufflib-formulate 0.0.1
 * A RuffLIB library for transforming an object schema into an HTML form.
 * https://richplastow.com/rufflib-formulate
 * @license MIT
 */


// rufflib-validate/src/formulate.js

// Assembles the `Formulate` class.


/* --------------------------------- Import --------------------------------- */

const VERSION = '0.0.1';
// Formulate.prototype.foo = foo;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Formulate tests.
function test(expect, Formulate) {
    expect().section('Formulate basics');
    expect(`typeof Formulate // in JavaScript, a class is type 'function'`,
            typeof Formulate).toBe('function');
    expect(`Formulate.VERSION`,
            Formulate.VERSION).toBe(VERSION);
    expect(`typeof new Formulate()`,
            typeof new Formulate()).toBe('object');
    expect(`new Formulate()`,
            new Formulate()).toHave({
                foo: undefined,
            });
}

// rufflib-formulate/src/entry-point-for-tests.js

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
function formulateTest(expect, Formulate) {

    test(expect, Formulate);

}

export { formulateTest as default };
