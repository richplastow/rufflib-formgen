// rufflib-formulate/src/helpers/dom-helpers.js


/* --------------------------------- Import --------------------------------- */

import { CSS_PREFIX } from './constants.js';


/* --------------------------- Public DOM Helpers --------------------------- */

// Maximises a minimised, or minimises a maximised <FIELDSET>.
export function toggleMinimisation($target) {
    if (_isMin($target)) {
        _maximise($target);
    } else {
        _minimise($target);
    }
}

// Syntactic sugar for identifying an element by its class attribute.
export function isFieldset($el) {
    return $el.classList.contains(`${CSS_PREFIX}fieldset`) }


/* --------------------------- Private DOM Helpers -------------------------- */

// Maximises a <FIELDSET>.
function _maximise($el) {
    let height = 1;
    for (let i=0, l=$el.childNodes.length; i<l; i++) {
        const $child = $el.childNodes[i];
        if (isFieldset($child)) {
            height += $child.style.height.slice(0,-2) / 30;
        } else if (_isRow($child)) {
            height += 1;
        }
    }
    $el.style.height = `${height*30}px`;
    $el.classList.remove(`${CSS_PREFIX}min`);
    const $container = $el.parentNode;
    if (_isFieldsetOrForm($container)) _updateHeight($container);
}

// Minimises a <FIELDSET>.
function _minimise($el) {
    $el.style.height = `30px`;
    $el.classList.add(`${CSS_PREFIX}min`);
    const $container = $el.parentNode;
    if (_isFieldsetOrForm($container)) _updateHeight($container);
}

// Sets an element’s height based on the current height of its child nodes.
function _updateHeight($el) {
    let height = isFieldset($el) ? 1 : 0; // if not a fieldset, a form
    for (let i=0, l=$el.childNodes.length; i<l; i++) {
        const $child = $el.childNodes[i];
        if (isFieldset($child)) {
            height += $child.style.height.slice(0,-2) / 30;
        } else if (_isRow($child)) {
            height += 1;
        }
    }
    $el.style.height = `${height*30}px`;
    const $container = $el.parentNode;
    if (_isFieldsetOrForm($container)) _updateHeight($container);
}

// Syntactic sugar for identifying an element by its class attribute.
function _isMin($el) {
    return $el.classList.contains(`${CSS_PREFIX}min`) }
function _isRow($el) {
    return $el.classList.contains(`${CSS_PREFIX}row`) }
function _isForm($el) {
    return $el.classList.contains(`${CSS_PREFIX}form`) }
function _isFieldsetOrForm($el) {
    return isFieldset($el) || _isForm($el) }


/* ---------------------------------- Tests --------------------------------- */

// Tests toggleMinimisation(). @TODO
export function testToggleMinimisation(expect, Formulate) {
    // expect().section('toggleMinimisation()');
}
