// rufflib-validate/src/formulate.js

// Assembles the `Formulate` class.


/* --------------------------------- Import --------------------------------- */

const VERSION = '0.0.1';

// import foo from './methods/foo.js';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for succinctly validating JavaScript values.
//
// Typical usage:
//     @TODO
//     
export default class Formulate {
    constructor() {
    }
}

Formulate.VERSION = VERSION;
// Formulate.prototype.foo = foo;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Formulate tests.
export function test(expect, Formulate) {
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
