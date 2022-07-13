// rufflib-formulate/src/formulate.js

// Assembles the `Formulate` class.


/* --------------------------------- Import --------------------------------- */

const VERSION = '0.0.1';

import Validate from 'rufflib-validate';
import { schemaToSteps, render } from './helpers/class-helpers.js';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for succinctly validating JavaScript values.
//
// Typical usage:
//
//     new Formulate(
//         document.querySelector('#wrap'),
//         'my_form'
//         {
//             _meta: { title:'My Form' },
//             outer: {
//                 _meta: { title:'Outer' },
//                 an_inner_boolean: Formulate.boolean(false),
//                 another_boolean: Formulate.boolean(true),
//             },
//             outer_boolean: Formulate.boolean(true),
//         },
//     );
//
export default class Formulate {

    constructor($container, identifier, schema) {
        // Validate and store the instantiation arguments.
        const v = new Validate('new Formulate()', false);
        if (!($container instanceof HTMLElement))
            return this.err = `myFunction(): '$container' is not an HTMLElement`;
        if (! v.string(identifier, 'identifier', /^[_a-z][_0-9a-z]*$/))
            return this.err = v.err;
        if (! v.schema(schema, 'schema'))
            return this.err = v.err;
        this.$container = $container;
        this.identifier = identifier;
        this.schema = schema;

        const [height, steps] = schemaToSteps(schema, identifier);
        this.height = height;
        this.steps = steps;
        render($container, steps);
        $container.style.height = `${height*30}px`;
    }

    static boolean(initially) {
        return {
            initially,
            kind: 'boolean',
        }
    }

    toObject() {
        return {
            height: this.height,
            schema: this.schema,
            steps: this.steps,
        }
    }
}

Formulate.VERSION = VERSION;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic tests on Formulate.
export function testFormulateBasics(expect, Formulate) {
    const $el = document.createElement('div');
    expect().section('Formulate basics');

    // Is a class.
    expect(`typeof Formulate`, typeof Formulate).toBe('function');

    // Invalid contructor arguments.
    expect(`new Formulate()`,
            new Formulate()).toHave({
                err:`myFunction(): '$container' is not an HTMLElement` });
    expect(`new Formulate($el)`,
            new Formulate($el)).toHave({
                err:`new Formulate(): 'identifier' is type 'undefined' not 'string'` });
    expect(`new Formulate($el, '1abc')`,
            new Formulate($el, '1abc')).toHave({
                err:`new Formulate(): 'identifier' \"1abc\" fails /^[_a-z][_0-9a-z]*$/` });
    expect(`new Formulate($el, 'abc')`,
            new Formulate($el, 'abc')).toHave({
                err:`new Formulate(): 'schema' is type 'undefined' not an object` });
    expect(`new Formulate($el, 'abc', {_meta:{},a:{kind:'number'},b:{kind:'nope!'}})`,
            new Formulate($el, 'abc', {_meta:{},a:{kind:'number'},b:{kind:'nope!'}})).toHave({
                err:`new Formulate(): 'schema.b.kind' not recognised` });

    // Contructor arguments ok.
    expect(`new Formulate($el, 'abc', {_meta:{title:'Abc'}})`,
            new Formulate($el, 'abc', {_meta:{title:'Abc'}})).toHave({
                $container: $el,
                identifier: 'abc',
                schema: { _meta:{title:'Abc'} },
            });
}

// Runs typical usage tests. @TODO
export function testTypicalUsage(expect, Formulate) {
    // expect().section('Typical usage');
}
