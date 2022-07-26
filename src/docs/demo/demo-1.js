// rufflib-formulate/src/docs/demo/demo-1.js

// The ‘main’ file for bundling the first Formulate demo.


/* --------------------------------- Import --------------------------------- */

import Validate from 'rufflib-validate';


/* ---------------------------------- Main ---------------------------------- */

// Runs ‘Demo 1’.
export function formulateDemo1(
    Formulate,
    $el,
) {
    // Validate the arguments.
    const v = new Validate('formulateDemo1()');
    if (! v.class(Formulate, 'Formulate', { _meta:{},
                name:    { kind:'string', rule:/^Formulate$/ },
                VERSION: { kind:'string', rule:/^0\.0\.1$/ } })
     || ! v.object($el, '$el', { _meta:{},
                $log:   { _meta: { inst: HTMLElement } },
                $form0: { _meta: { inst: HTMLElement } },
                $form1: { _meta: { inst: HTMLElement } } })
    ) return { error:v.err };
    const { $log, $form0, $form1 } = $el;

    // Generate the top form.
    const schema0 = {
        _meta: { title:'Top Form' },
        outer: {
            _meta: { title:'Outer' },
            a_boolean: Formulate.boolean(false),
            another_boolean: Formulate.boolean(true),
        },
        foo: Formulate.boolean(true),
    }
    const f0 = new Formulate($form0, 'schema0', schema0);
    if (f0.error) throw Error(f0.error);
    $log.innerHTML = `new Formulate($form0, 'schema0', schema0) =>\n\n`;
    $log.innerHTML += JSON.stringify(f0.toObject(), null, 2);

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
    }
    const f1 = new Formulate($form1, 'schema1', schema1);
    if (f1.error) throw Error(f1.error);
}


/* ---------------------------------- Tests --------------------------------- */

// Runs tests on ‘Demo 1’.
export function testDemo1(expect, Formulate) {
    expect.section('Demo 1');
    const et = expect.that;

    // Basics.
    et(`typeof formulateDemo1`, typeof formulateDemo1).is('function');

    // Invalid arguments.
    et(`formulateDemo1()`,
        formulateDemo1()).hasError(
        `formulateDemo1(): 'Formulate' is type 'undefined' not 'function'`);
    et(`formulateDemo1(function () {})`,
        formulateDemo1(function () {})).hasError(
        `formulateDemo1(): 'Formulate.name' "" fails /^Formulate$/`);
    et(`formulateDemo1(class Nope {})`,
        formulateDemo1(class Nope {})).hasError(
        `formulateDemo1(): 'Formulate.name' "Nope" fails /^Formulate$/`);
    et(`formulateDemo1(class Formulate {})`,
        formulateDemo1(class Formulate {})).hasError(
        `formulateDemo1(): 'Formulate.VERSION' is type 'undefined' not 'string'`);
    et(`formulateDemo1(class Formulate { static VERSION = 'Also Nope' })`,
        formulateDemo1(class Formulate { static VERSION = 'Also Nope' })).hasError(
        `formulateDemo1(): 'Formulate.VERSION' "Also Nope" fails /^0\\.0\\.1$/`);
    et(`formulateDemo1(class Formulate { static VERSION = '0.0.1' })`,
        formulateDemo1(class Formulate { static VERSION = '0.0.1' })).hasError(
        `formulateDemo1(): '$el' is type 'undefined' not 'object'`);
    et(`formulateDemo1(class Formulate { static VERSION = '0.0.1' }, {})`,
        formulateDemo1(class Formulate { static VERSION = '0.0.1' }, {})).hasError(
        `formulateDemo1(): '$el.$log' is type 'undefined' not an object`);
    const $mock = document.createElement('div');
    et(`formulateDemo1(Formulate, { $log:$mock, $form0:{}, $form1:1 })`,
        formulateDemo1(Formulate, { $log:$mock, $form0:{}, $form1:1 })).hasError(
        `formulateDemo1(): '$el.$form0' is not an instance of 'HTMLElement'`);
    et(`formulateDemo1(Formulate, { $log:$mock, $form0:$mock, $form1:null })`,
        formulateDemo1(Formulate, { $log:$mock, $form0:$mock, $form1:null })).hasError(
        `formulateDemo1(): '$el.$form1' is null not an object`);

    // Working ok.
    et(`formulateDemo1(Formulate, { $log:$mock, $form0:$mock, $form1:$mock })`,
        formulateDemo1(Formulate, { $log:$mock, $form0:$mock, $form1:$mock })).is(undefined);
}
