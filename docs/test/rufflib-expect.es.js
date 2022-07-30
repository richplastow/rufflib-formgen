/**
 * rufflib-expect 3.0.0
 * A RuffLIB library for unit testing rough and sketchy JavaScript apps.
 * https://richplastow.com/rufflib-expect
 * @license MIT
 */


// rufflib-expect/src/methods/generate-css.js


const RX_SELECTOR = /^[.#]?[a-z][-_0-9a-z]*$/i;

/* --------------------------------- Method --------------------------------- */

// Public method which generates CSS for styling render('Html')’s output.
//
// Typical usage:
//     const $css = document.createElement('style');
//     $css.innerHTML = Expect.generateCss('#my-test-results-container', 'pre');
//     document.head.appendChild($css);
//
function generateCss(
    containerSelector, // a CSS selector, eg '#wrap', '.test-results' or 'body'
    innerSelector, // a CSS selector like '#inner', '.box' or 'pre'
) {
    // Abbreviate the argument names - this just helps shorten the source code.
    const cs = containerSelector;
    const is = innerSelector;

    // Validate the selectors.
    if (! cs) throw Error(
        `Expect.generateCss(): the mandatory containerSelector argument is falsey`);
    if (typeof cs !== 'string') throw Error(
        `Expect.generateCss(): containerSelector is type '${typeof cs}' not 'string'`);
    if (! RX_SELECTOR.test(cs)) throw Error(
        `Expect.generateCss(): containerSelector fails ${RX_SELECTOR}`);
    if (! is) throw Error(
        `Expect.generateCss(): the mandatory innerSelector argument is falsey`);
    if (typeof is !== 'string') throw Error(
        `Expect.generateCss(): innerSelector is type '${typeof is}' not 'string'`);
    if (! RX_SELECTOR.test(is)) throw Error(
        `Expect.generateCss(): innerSelector fails ${RX_SELECTOR}`);

    // Initialise the output array.
    // Note that our validated selectors cannot include the substring '*/', here.
    const css = [`/* Expect.generateCss('${cs}', '${is}') */`];

    // The outer element is assumed to be styled already. generateCss() just
    // updates the colours when the tests complete.
    css.push(
        `${cs}.fail{background:#642c2c;color:#fce}`,
        `${cs}.pass{background:#2c642c;color:#cfe}`,
    );

    // generateCss() takes more control over styling the inner element...
    css.push(
        `${is}{padding:4px 8px;border-radius:4px;line-height:1.8}`,
        `${is}{font-family:Menlo,Consolas,Monaco,Lucida Console,Liberation Mono,`,
        `DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,sans-serif}`,
        `${is}{text-align:left;white-space:pre}`,
        `${is}{background:#222;color:#eee}`, // before the tests complete
        `${cs}.fail ${is}{background:#411;color:#fce}`,
        `${cs}.pass ${is}{background:#141;color:#cfe}`,
        `${cs}.fail hr{border-color:#642c2c}`,
        `${cs}.pass hr{border-color:#2c642c}`,
    );

    // ...and the test result content.
    css.push(
        `${is} h2{margin:0}`,
        `${is} b{color:#eee}`,
        `${is} i{font-style:normal}`,
        `${cs}.pass i{color:#7fff7f}`,
        `${is} u{padding:2px 8px;color:#fff;background:#900;text-decoration:none}`,
        `${is} s{color:#9c8293;text-decoration:none}`,
    );

    return css.join('\n');
}

// rufflib-expect/src/methods/render.js


/* -------------------------------- Constants ------------------------------- */

const ERROR_PREFIX = 'expect.render(): ';

// Colours and styles for for ANSI text, eg for a Terminal.
const ANSI_BOLD = '\u001b[1m';
const ANSI_DLOB = '\u001b[0m';
const ANSI_DIM  = '\u001b[2m';
const ANSI_MID  = '\u001b[0m';
const ANSI_PASS = '\u001b[32m√ ';
const ANSI_SSAP = '\u001b[0m';
const ANSI_FAIL = '\u001b[31mX ';
const ANSI_LIAF = '\u001b[0m';

// HTML elements (tags), eg for a web browser.
const HTML_HEADING = '<h2>';
const HTML_GNIDAEH = '</h2>';
const HTML_BOLD = '<b>';
const HTML_DLOB = '</b>';
const HTML_DIM  = '<s>';
const HTML_MID  = '</s>';
const HTML_PASS = '<i>√ ';
const HTML_SSAP = '</i>';
const HTML_FAIL = '<u>X ';
const HTML_LIAF = '</u>';


/* --------------------------------- Method --------------------------------- */

// Public method which transforms test results to a string, in various formats.
function render(
    format='Plain', // how output should be formatted, `Ansi|Html|Json|Plain|Raw`
    sectionMustContain='', // only show sections which contain this string
    verbose=false, // if true, show passing sections and tests
) {
    const { log, failTally, passTally, sections, suiteTitle } = this;
    const renderer = ({
        Ansi: _renderAnsi,
        Html: _renderHtml,
        Json: _renderJson,
        Plain: _renderPlain,
        Raw: _renderRaw,
    })[format];
    if (! renderer) throw Error(
        `${ERROR_PREFIX}unexpected format, try 'Ansi|Html|Json|Plain|Raw'`);
    return renderer(log, failTally, passTally, sections, suiteTitle,
        sectionMustContain.toLowerCase(), verbose);
}


/* ----------------------------- Private Helpers ---------------------------- */

// Renders test results for ANSI text output, eg to a Terminal.
function _renderAnsi(log, failTally, passTally, sections, suiteTitle, smcLc, verbose) {
    const summary = _renderSummaryAnsi(failTally, passTally, suiteTitle);
    return summary
        + log.map(item => {
          const sectionTitle = item.sectionTitle
                ? item.sectionTitle
                : sections[item.sectionIndex].sectionTitle
            ;
          if (sectionTitle.toLowerCase().includes(smcLc)) {
              switch (item.kind) {
                  case 'Error':
                      return `${ANSI_FAIL}Failed${ANSI_LIAF} ${item.testTitle}:\n`
                          + `  ${ANSI_DIM}actually is an error:${ANSI_MID}\n`
                          + `  ${item.actually}\n`;
                  case 'Failed':
                      return `${ANSI_FAIL}Failed${ANSI_LIAF} ${item.testTitle}:\n`
                          + `  ${ANSI_DIM}expected:${ANSI_MID} ${item.expected}\n`
                          + `  ${ANSI_DIM}actually:${ANSI_MID} ${item.actually}\n`;
                  case 'Passed':
                      return verbose
                            ? `${ANSI_PASS}Passed${ANSI_SSAP} ${item.testTitle}\n`
                          : '';
                  case 'SectionTitle':
                      return verbose || sections[item.sectionIndex].failTally
                            ? `\n${ANSI_BOLD}${item.sectionTitle}:${ANSI_DLOB}\n`
                              + '-'.repeat(item.sectionTitle.length+1) + '\n'
                          : '';
                  default: throw Error(`${ERROR_PREFIX}unexpected item.kind`);
              }
          }
        })
        .join('')
        + (verbose ? '\n\n' + summary : '')
    ;
}

// Renders the test results summary for ANSI text output, eg to a Terminal.
function _renderSummaryAnsi(failTally, passTally, suiteTitle) {
    return '-'.repeat(79)
        + '\n'
        + `${ANSI_BOLD}${suiteTitle}${ANSI_DLOB}\n`
        + '='.repeat(suiteTitle.length)
        + '\n'
        + (failTally
            ? `${ANSI_FAIL}Failed${ANSI_LIAF} ${failTally} of ${failTally + passTally}`
          : `${ANSI_PASS}Passed${ANSI_SSAP} ${passTally} test${passTally === 1 ? '' : 's'}`
        )
        + '\n'
        + '-'.repeat(79)
        + '\n'
    ;
}

// Renders test results for HTML output, eg to a web browser.
function _renderHtml(log, failTally, passTally, sections, suiteTitle, smcLc, verbose) {
    const summary = _renderSummaryHtml(failTally, passTally, suiteTitle);
    return summary
        + log.map(item => {
          const sectionTitle = item.sectionTitle
                ? item.sectionTitle
                : sections[item.sectionIndex].sectionTitle
            ;
          if (sectionTitle.toLowerCase().includes(smcLc)) {
              switch (item.kind) {
                  case 'Error':
                      return `${HTML_FAIL}Failed${HTML_LIAF} ${item.testTitle}:\n`
                          + `  ${HTML_DIM}actually is an error:${HTML_MID}\n`
                          + `  ${item.actually}\n`;
                  case 'Failed':
                      return `${HTML_FAIL}Failed${HTML_LIAF} ${item.testTitle}:\n`
                          + `  ${HTML_DIM}expected:${HTML_MID} ${item.expected}\n`
                          + `  ${HTML_DIM}actually:${HTML_MID} ${item.actually}\n`;
                  case 'Passed':
                      return verbose
                            ? `${HTML_PASS}Passed${HTML_SSAP} ${item.testTitle}\n`
                          : '';
                  case 'SectionTitle':
                      return verbose || sections[item.sectionIndex].failTally
                            ? `\n${HTML_BOLD}${item.sectionTitle}:${HTML_DLOB}\n`
                          : '';
                  default: throw Error(`${ERROR_PREFIX}unexpected item.kind`);
              }
          }
        })
        .join('')
        + (verbose ? '\n\n' + summary : '')
    ;
}

// Renders the test results summary for HTML output, eg to a web browser.
function _renderSummaryHtml(failTally, passTally, suiteTitle) {
    return '<hr>'
        + `${HTML_HEADING}${suiteTitle}${HTML_GNIDAEH}\n`
        + (failTally
            ? `${HTML_FAIL}Failed${HTML_LIAF} ${failTally} of ${failTally + passTally}`
          : `${HTML_PASS}Passed${HTML_SSAP} ${passTally} test${passTally === 1 ? '' : 's'}`
        )
        + '\n<hr>\n'
    ;
}

// Renders the test results summary as a stringified JSON object, eg for logging.
function _renderJson(log, failTally, passTally, sections, suiteTitle, smcLc, verbose) {
    return '{\n'
        + `  "fail_tally": ${failTally},\n`
        + `  "pass_tally": ${passTally},\n`
        + `  "status": "${failTally ? 'fail' : 'pass'}",\n`
        + `  "suite_title": "${suiteTitle}",\n` // @TODO escape suiteTitle
        + `  "log": [\n`
        + log.map(item => {
          const sectionTitle = item.sectionTitle
                ? item.sectionTitle
                : sections[item.sectionIndex].sectionTitle
            ;
          if (sectionTitle.toLowerCase().includes(smcLc)) {
              switch (item.kind) {
                  case 'Error':
                      return `    { "kind": "Error", "test_title": "${item.testTitle}",\n`
                           + `      "error": ${JSON.stringify(item.actually)} },\n`
                  case 'Failed':
                      return `    { "kind": "Failed", "test_title": "${item.testTitle}",\n`
                           + `      "expected": ${JSON.stringify(item.expected)},\n`
                           + `      "actually": ${JSON.stringify(item.actually)} },\n`;
                  case 'Passed':
                      return verbose
                            ? `    { "kind": "Passed", "test_title": "${item.testTitle}" },\n`
                          : '';
                  case 'SectionTitle':
                      return verbose || sections[item.sectionIndex].failTally
                            ? `    { "kind": "SectionTitle", "section_title": "${item.sectionTitle}" },\n`
                          : '';
                  default: throw Error(`${ERROR_PREFIX}unexpected item.kind`);
              }
          }
        })
        .join('')
        .slice(0, -2) // remove the trailing comma
        + '\n  ]\n}'
    ;
}

// Renders test results for plain text output, eg to a '.txt' file.
function _renderPlain(log, failTally, passTally, sections, suiteTitle, smcLc, verbose) {
    const summary = _renderSummaryPlain(failTally, passTally, suiteTitle);
    return summary
        + log.map(item => {
          const sectionTitle = item.sectionTitle
                ? item.sectionTitle
                : sections[item.sectionIndex].sectionTitle
            ;
          if (sectionTitle.toLowerCase().includes(smcLc)) {
              switch (item.kind) {
                  case 'Error':
                      return `Failed ${item.testTitle}:\n`
                          + `  actually is an error:\n`
                          + `  ${item.actually}\n`;
                  case 'Failed':
                      return `Failed ${item.testTitle}:\n`
                          + `  expected: ${item.expected}\n`
                          + `  actually: ${item.actually}\n`;
                  case 'Passed':
                      return verbose
                            ? `Passed ${item.testTitle}\n`
                          : '';
                  case 'SectionTitle':
                      return verbose || sections[item.sectionIndex].failTally
                            ? `\n${item.sectionTitle}:\n`
                              + '-'.repeat(item.sectionTitle.length+1) + '\n'
                          : '';
                  default: throw Error(`${ERROR_PREFIX}unexpected item.kind`);
              }
          }
        })
        .join('')
        + (verbose ? '\n\n' + summary : '')
    ;
}

// Renders the test results summary for ANSI text output, eg to a Terminal.
function _renderSummaryPlain(failTally, passTally, suiteTitle) {
    return '-'.repeat(79)
        + '\n'
        + `${suiteTitle}\n`
        + '='.repeat(suiteTitle.length)
        + '\n'
        + (failTally
            ? `Failed ${failTally} of ${failTally + passTally}`
          : `Passed ${passTally} test${passTally === 1 ? '' : 's'}`
        )
        + '\n'
        + '-'.repeat(79)
        + '\n'
    ;
}

// Returns the test suite’s `log` property as-is.
function _renderRaw(log) { return log }

// rufflib-expect/src/methods/expect.js


/* --------------------------------- Method --------------------------------- */

// Public method which returns several sub-methods.
function that(
    testTitle, // the title of this test (omitted if `section()` is called)
    actually,  // the value to test (omitted if `section()` is called)
) {
    const log = this.log;
    const sections = this.sections;
    const addSection = (sectionTitle) => {
        return sections.push({ failTally: 0, sectionTitle }) - 1; // return its index
    };
    const fail = () => {
        sections[sections.length-1].failTally++;
        this.failTally++;
        this.status = 'fail';
        return sections.length - 1;
    };
    const pass = () => {
        this.passTally++;
        return sections.length - 1;
    };
    return {

        // Logs a section-title.
        // Values passed in to `testTitle` and `actually` are ignored.
        section(sectionTitle='Untitled Section') {
            log.push({
                kind: 'SectionTitle',
                sectionIndex: addSection(sectionTitle),
                sectionTitle,
            });
        },

        // Tests that `actually` and `expected` are strictly equal.
        is(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (actually === expected) {
                log.push({
                    kind: 'Passed',
                    sectionIndex: pass(),
                    testTitle,
                });
                return true;
            }
            log.push({
                actually,
                expected,
                kind: 'Failed',
                sectionIndex: fail(),
                testTitle,
            });
            return false;
        },

        // Tests that `actually` is an object with an expected `error` property.
        // @TODO allow `expected` to be a regexp, or other object with a `test()` method
        hasError(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (actually && actually?.error === expected) {
                log.push({
                    kind: 'Passed',
                    sectionIndex: pass(),
                    testTitle,
                });
                return true;
            }
            log.push({
                actually: actually ? actually?.error : actually,
                expected,
                kind: 'Failed',
                sectionIndex: fail(),
                testTitle,
            });
            return false;
        },

        // Tests that `actually` contains all of the keys and values in `expected`.
        has(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (actually.error) {
                log.push({
                    actually: actually.error,
                    expected: JSON.stringify(expected),
                    kind: 'Error',
                    sectionIndex: fail(),
                    testTitle,
                });
                return false;
            }
            for (let key in expected) {
                const aJson = JSON.stringify(actually[key]);
                const eJson = JSON.stringify(expected[key]);
                if (aJson !== eJson) {
                    log.push({
                        actually: aJson,
                        expected: eJson,
                        kind: 'Failed',
                        sectionIndex: fail(),
                        testTitle: `${testTitle}.${key}`,
                    });
                    return false;
                }
            }
            log.push({
                kind: 'Passed',
                sectionIndex: pass(),
                testTitle,
            });
            return true;
        },

        // Tests that `actually` and `expected` are identical when stringified to JSON.
        stringifiesTo(expected) {
            if (! sections.length) this.section(); // there must be a section
            const aJson = JSON.stringify(actually);
            const eJson = JSON.stringify(expected);
            if (aJson === eJson) {
                log.push({
                    kind: 'Passed',
                    sectionIndex: pass(),
                    testTitle,
                });
                return true;
            }
            log.push({
                actually: aJson,
                expected: eJson,
                kind: 'Failed',
                sectionIndex: fail(),
                testTitle,
            });
            return false;
        },

        // Tests that `actually` passes the test defined by `expected`.
        // Typically used for regular expression tests.
        passes(expected) {
            if (! sections.length) this.section(); // there must be a section
            if (expected && expected?.test(actually)) {
                log.push({
                    kind: 'Passed',
                    sectionIndex: pass(),
                    testTitle,
                });
                return true;
            }
            log.push({
                actually,
                expected,
                kind: 'Failed',
                sectionIndex: fail(),
                testTitle,
            });
            return false;
        },
    }
}

// rufflib-expect/src/methods/section.js


/* --------------------------------- Method --------------------------------- */

// Public method which starts a new section in the current test suite.
function section(
    sectionTitle = 'Untitled Section'
) {
    this.log.push({
        kind: 'SectionTitle',
        sectionIndex: this.sections.push({ failTally: 0, sectionTitle }) - 1,
        sectionTitle,
    });
}

// rufflib-expect/src/expect.js

// Assembles the `Expect` class.


/* --------------------------------- Import --------------------------------- */

const NAME = 'Expect';
const VERSION = '3.0.0';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for unit testing rough and sketchy JavaScript apps.
//
// Typical usage:
//
//     import Expect from 'rufflib-expect';
//
//     const expect = new Expect('Mathsy Test Suite');
//     expect.section('Check that factorialise() works');
//     expect.that(`factorialise(5) // 5! = 5 * 4 * 3 * 2 * 1`,
//                  factorialise(5)).is(120);
//
//     console.log(expect.render('Ansi'));
//
//     function factorialise(n) {
//         if (n === 0 || n === 1) return 1;
//         for (let i=n-1; i>0; i--) n *= i;
//         return n;
//     }
//
class Expect {
    static name = NAME; // make sure minification doesn’t squash the `name` property
    static VERSION = VERSION;

    constructor(suiteTitle='Untitled Test Suite') {
        this.that = that.bind(this);
        this.suiteTitle = suiteTitle;
        this.reset();
    }

    // Initialises all properties apart from `suiteTitle`.
    // Called by `constructor()`, and can also make unit testing Expect simpler.
    reset() {
        this.log = [];
        this.sections = [];

        // No tests have run, so no tests failed and no tests passed.
        // Technically, the test suite status is currently ‘pass’.
        this.failTally = 0;
        this.passTally = 0;
        this.status = 'pass';
    }
}

Expect.VERSION = VERSION;
Expect.generateCss = generateCss;
Expect.prototype.render = render;
Expect.prototype.section = section;

// rufflib-expect/src/entry-point-main.js

export { Expect as default };
