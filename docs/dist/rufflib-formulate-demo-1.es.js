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
function formulateDemo1(
    Formulate,
    { $log, $form0, $form1 } = {},
) {
    if (! $log || ! $form0 || ! $form1) throw Error('Missing an element');

    // Generate the top form.
    const schema0 = {
        _meta: { title:'Top Form' },
        outer: {
            _meta: { title:'Outer' },
            a_boolean: Formulate.boolean(false),
            another_boolean: Formulate.boolean(true),
        },
        foo: Formulate.boolean(true),
    };
    const sg0 = new Formulate($form0, 'schema0', schema0);
    $log.innerHTML = `new Formulate($form0, 'schema0', schema0) =>\n\n`;
    $log.innerHTML += JSON.stringify(sg0.toObject(), null, 2);

    // Generate the second form.
    const schema1 = {
        _meta: { title:'Second Form' },
        outer: {
            _meta: { title:'Outer' },
            foo: Formulate.boolean(false),
            inner: {
                _meta: { title:'Inner' },
                bar: Formulate.boolean(false),
                baz: Formulate.boolean(true),
            },
            zub: Formulate.boolean(false),
        },
    };
    new Formulate($form1, 'schema1', schema1);
}


/* ---------------------------------- Tests --------------------------------- */

// Runs tests on ‘Demo 1’.
function testDemo1(expect, Formulate) {
    expect.section('Demo 1');
    const et = expect.that;

    // Basics.
    et(`typeof formulateDemo1`, typeof formulateDemo1).is('function');

    // // Invalid arguments.
    // et(`formulateDemo1()`,
    //     formulateDemo1()).hasError(
    //     `formulateDemo1(): 'Formulate' is not an object`);
}

export { formulateDemo1, testDemo1 };
