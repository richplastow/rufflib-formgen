// rufflib-formulate/src/entry-point-for-tests.js

// Entry point for running the unit tests in Formulate’s source files.
// Also used for building Formulate’s unit test distribution files.

import { testFormulateBasics } from './formulate.js';

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
export default function formulateTest(expect, Formulate) {

    // Mock a DOM, for NodeJS.
    if (typeof global === 'object') {
        global.HTMLElement = class HTMLElement {
            addEventListener() { }
            appendChild() { }
            createElement() { return new HTMLElement() }
        };
        HTMLElement.prototype.classList = { add() {} }
        HTMLElement.prototype.style = {}
        global.document = new HTMLElement();
    }

    testFormulateBasics(expect, Formulate);

}
