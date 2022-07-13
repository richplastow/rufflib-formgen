/**
 * Unit tests for rufflib-formulate 0.0.1
 * A RuffLIB library for transforming an object schema into an HTML form.
 * https://richplastow.com/rufflib-formulate
 * @license MIT
 */


// rufflib-formulate/src/formulate.js


/* ---------------------------------- Tests --------------------------------- */

// Runs basic tests on Formulate.
function testFormulateBasics(expect, Formulate) {
    const $el = document.createElement('div');
    expect().section('Formulate basics');

    // Is a class.
    expect(`typeof Formulate`, typeof Formulate).toBe('function');

    // Invalid constructor arguments.
    expect(`new Formulate()`,
            new Formulate()).toError(
            `new Formulate(): '$container' is not an HTMLElement`);
    expect(`new Formulate($el)`,
            new Formulate($el)).toError(
            `new Formulate(): 'identifier' is type 'undefined' not 'string'`);
    expect(`new Formulate($el, '1abc')`,
            new Formulate($el, '1abc')).toError(
            `new Formulate(): 'identifier' \"1abc\" fails /^[_a-z][_0-9a-z]*$/`);
    expect(`new Formulate($el, 'abc')`,
            new Formulate($el, 'abc')).toError(
            `new Formulate(): 'schema' is type 'undefined' not an object`);
    expect(`new Formulate($el, 'abc', {_meta:{},a:{kind:'number'},b:{kind:'nope!'}})`,
            new Formulate($el, 'abc', {_meta:{},a:{kind:'number'},b:{kind:'nope!'}})).toError(
            `new Formulate(): 'schema.b.kind' not recognised`);
    expect(`new Formulate($el, 'abc', {_meta:{}})`,
            new Formulate($el, 'abc', {_meta:{}})).toError(
            `new Formulate(): 'schema._meta.title' is type 'undefined' not 'string'`);
    expect(`new Formulate($el, 'abc', {_meta:{title:''}})`,
            new Formulate($el, 'abc', {_meta:{title:''}})).toError(
            `new Formulate(): 'schema._meta.title' "" fails /^[-_ 0-9a-z...2}$/i`);

    // constructor arguments ok.
    expect(`new Formulate($el, 'abc', {_meta:{title:'Abc'}})`,
            new Formulate($el, 'abc', {_meta:{title:'Abc'}})).toHave({
                $container: $el,
                identifier: 'abc',
                schema: { _meta:{title:'Abc'} },
            });
}

// rufflib-formulate/src/entry-point-for-tests.js

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
function formulateTest(expect, Formulate) {

    // Mock a DOM, for NodeJS.
    if (typeof global === 'object') {
        global.HTMLElement = class HTMLElement {
            addEventListener() { }
            appendChild() { }
            createElement() { return new HTMLElement() }
        };
        HTMLElement.prototype.classList = { add() {} };
        HTMLElement.prototype.style = {};
        global.document = new HTMLElement();
    }

    testFormulateBasics(expect, Formulate);

}

export { formulateTest as default };
