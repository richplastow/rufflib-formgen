// rufflib-formulate/src/formulate.js

// Assembles the `Formulate` class.


/* --------------------------------- Import --------------------------------- */

import Validate from 'rufflib-validate';

import { ID_PREFIX, RX_IDENTIFIER, RX_META_TITLE, VERSION }
    from './helpers/constants.js';
import { buildRenderInstructions } from './helpers/build-render-instructions.js';
import { render } from './helpers/render.js';


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

        // Validate the constructor arguments.
        if (! ($container instanceof HTMLElement))
            return this.error = `new Formulate(): '$container' is not an HTMLElement`;
        const v = new Validate('new Formulate()', false);
        if (! v.string(identifier, 'identifier', RX_IDENTIFIER)
         || ! v.schema(schema, 'schema')
         || ! v.object(schema._meta, 'schema._meta', {
                _meta:{}, title:{ kind:'string', rule:RX_META_TITLE } })
        ) return this.error = v.err;

        // Store the constructor arguments.
        this.$container = $container;
        this.identifier = identifier;
        this.schema = schema;

        const result = buildRenderInstructions(
            schema, // schema
            `${ID_PREFIX}.${identifier}`, // path
            1, // depth
            true, // skipValidation
        );
        if (result.error) return this.error = result.error;
        const { height, steps } = result;
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
    const et = expect.that;
    expect.section('Formulate basics');

    const $el = document.createElement('div');

    // Is a class.
    et(`typeof Formulate`, typeof Formulate).is('function');

    // Invalid constructor arguments.
    et(`new Formulate()`,
        new Formulate()).hasError(
        `new Formulate(): '$container' is not an HTMLElement`);
    et(`new Formulate($el)`,
        new Formulate($el)).hasError(
        `new Formulate(): 'identifier' is type 'undefined' not 'string'`);
    et(`new Formulate($el, '1abc')`,
        new Formulate($el, '1abc')).hasError(
        `new Formulate(): 'identifier' \"1abc\" fails /^[_a-z][_0-9a-z]*$/`);
    et(`new Formulate($el, 'abc')`,
        new Formulate($el, 'abc')).hasError(
        `new Formulate(): 'schema' is type 'undefined' not an object`);
    et(`new Formulate($el, 'abc', {_meta:{},a:{kind:'number'},b:{kind:'nope!'}})`,
        new Formulate($el, 'abc', {_meta:{},a:{kind:'number'},b:{kind:'nope!'}})).hasError(
        `new Formulate(): 'schema.b.kind' not recognised`);
    et(`new Formulate($el, 'abc', {_meta:{}})`,
        new Formulate($el, 'abc', {_meta:{}})).hasError(
        `new Formulate(): 'schema._meta.title' is type 'undefined' not 'string'`);
    et(`new Formulate($el, 'abc', {_meta:{title:''}})`,
        new Formulate($el, 'abc', {_meta:{title:''}})).hasError(
        `new Formulate(): 'schema._meta.title' "" fails /^[-_ 0-9a-z...2}$/i`);

    // constructor arguments ok.
    et(`new Formulate($el, 'abc', {_meta:{title:'Abc'}})`,
        new Formulate($el, 'abc', {_meta:{title:'Abc'}})).has({
            $container: $el,
            identifier: 'abc',
            schema: { _meta:{title:'Abc'} },
        });
}
