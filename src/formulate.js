// rufflib-formulate/src/formulate.js

// Assembles the `Formulate` class.


/* --------------------------------- Import --------------------------------- */

import Validate from 'rufflib-validate';

import { ID_PREFIX, NAME, RX_IDENTIFIER, RX_META_TITLE, VERSION }
    from './helpers/constants.js';
import { buildRenderInstructions } from './helpers/build-render-instructions.js';
import { render } from './helpers/render.js';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for transforming an object schema into an HTML <form> element.
//
// Typical usage:
//
//     new Formulate(
//         document.querySelector('#wrap'),
//         'my_form',
//         {
//             _meta: { title:'My Form' },
//             outer: {
//                 _meta: { title:'Outer' },
//                 an_inner_boolean: Formulate.boolean(false),
//                 another_boolean: Formulate.boolean(true),
//             },
//             outer_boolean: Formulate.boolean(true),
//         }
//     );
//
export default class Formulate {
    static name = NAME; // make sure minification doesn’t squash the `name` property
    static VERSION = VERSION;

    constructor($container, identifier, schema) {

        // Validate the constructor arguments.
        const v = new Validate('new Formulate()', false);
        if (! v.object($container, '$container', { _meta:{ inst:HTMLElement } })
         || ! v.string(identifier, 'identifier', RX_IDENTIFIER)
         || ! v.schema(schema, 'schema', { _meta:{},
                    title:{ kind:'string', rule:RX_META_TITLE } })
        ) return this.error = v.err;

        // Store the constructor arguments.
        this.$container = $container;
        this.identifier = identifier;
        this.schema = schema;

        const result = buildRenderInstructions(
            schema, // schema
            `${ID_PREFIX}.${identifier}`, // path
            1, // depth
            false, // skipValidation
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


/* ---------------------------------- Tests --------------------------------- */

// Runs basic tests on Formulate.
export function testFormulateBasics(expect, Formulate) {
    const et = expect.that;
    expect.section('Formulate basics');

    const $el = document.createElement('div');

    // Is a class.
    et(`typeof Formulate // in JavaScript, a class is type 'function'`,
        typeof Formulate).is('function');
    et(`Formulate.name // minification should not squash '${NAME}'`,
        Formulate.name).is(NAME);
    et(`Formulate.VERSION // make sure we are testing ${VERSION}`,
        Formulate.VERSION).is(VERSION);
    et(`typeof new Formulate() // invalid invocation, but still an object`,
        typeof new Formulate()).is('object');

    // Invalid constructor arguments.
    et(`new Formulate()`,
        new Formulate()).hasError(
        `new Formulate(): '$container' is type 'undefined' not 'object'`);
    et(`new Formulate({})`,
        new Formulate({})).hasError(
        `new Formulate(): '$container' is not an instance of 'HTMLElement'`);
    et(`new Formulate($el)`,
        new Formulate($el)).hasError(
        `new Formulate(): 'identifier' is type 'undefined' not 'string'`);
    et(`new Formulate($el, '1abc')`,
        new Formulate($el, '1abc')).hasError(
        `new Formulate(): 'identifier' \"1abc\" fails /^[_a-z][_0-9a-z]*$/`);
    et(`new Formulate($el, 'abc')`,
        new Formulate($el, 'abc')).hasError(
        `new Formulate(): 'schema' is type 'undefined' not an object`);
    et(`new Formulate($el, 'abc', {_meta:{title:'Ok'},a:{kind:'number'},b:{kind:'nope!'}})`,
        new Formulate($el, 'abc', {_meta:{title:'Ok'},a:{kind:'number'},b:{kind:'nope!'}})).hasError(
        `new Formulate(): 'schema.b.kind' not recognised`);
    et(`new Formulate($el, 'abc', {_meta:{}})`,
        new Formulate($el, 'abc', {_meta:{}})).hasError(
        `new Formulate(): 'schema._meta.title' is type 'undefined' not 'string'`);
    et(`new Formulate($el, 'abc', {_meta:{title:''}})`,
        new Formulate($el, 'abc', {_meta:{title:''}})).hasError(
        `new Formulate(): 'schema._meta.title' "" fails /^[-_ 0-9a-z...2}$/i`);
    const missingTitleSchema = {
        _meta: { title: 'The Top-Level Title Exists' },
        oops: { _meta: {} }, // no `title` in here!
    };
    et(`new Formulate($el, 'my_form', missingTitleSchema)`,
        new Formulate($el, 'my_form', missingTitleSchema)).hasError(
            `new Formulate(): 'schema.oops._meta.title' is type 'undefined' not 'string'`);

    // constructor arguments ok.
    et(`new Formulate($el, 'abc', {_meta:{title:'Abc'}})`,
        new Formulate($el, 'abc', {_meta:{title:'Abc'}})).has({
            $container: $el,
            identifier: 'abc',
            schema: { _meta:{title:'Abc'} },
        });
    const typicalUsageSchema = {
        _meta: { title: 'My Form' },
        outer: {
            _meta: { title: 'Outer' },
            an_inner_boolean: Formulate.boolean(false),
            another_boolean: Formulate.boolean(true),
        },
        outer_boolean: Formulate.boolean(true),
    };
    et(`new Formulate($el, 'my_form', typicalUsageSchema)`,
        new Formulate($el, 'my_form', typicalUsageSchema)).has({
            $container: $el,
            identifier: 'my_form',
            schema: typicalUsageSchema,
        });
}
