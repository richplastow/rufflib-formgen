// rufflib-formulate/src/helpers/render.js


/* --------------------------------- Import --------------------------------- */

import { CSS_PREFIX } from './constants.js';
import { toggleMinimisation, isFieldset } from './dom-helpers.js';


/* -------------------------- Public Class Helpers -------------------------- */

// Creates various elements, based on ‘step’ instructions.
export function render($container, steps) {
    // Reset container content, eg remove the text ‘Loading...’.
    $container.innerHTML = '';

    $container.style.height = `${steps[0].height*30}px`;

    // Step through each instruction. The last element in `$$containers`
    // is the current container element, so `$$containers.pop()` can be
    // used to go back up a level.
    const $$containers = [ $container ];
    for (let i=0, l=steps.length; i<l; i++) {
        const step = steps[i];
        const $curr = $$containers[$$containers.length-1]; // current container
        switch (step.kind) {
            case 'fieldsetDown':
                const $el = _buildFieldset(step);
                $curr.appendChild($el);
                $$containers.push($el);
                break;
            case 'fieldsetUp':
                $$containers.pop();
                break;
            case 'boolean':
                $curr.appendChild(_buildBoolean(step));
                break;
            default:
                throw Error(`steps[${i}].kind '${step.kind}' not recognised`);
        }
    }

    // Listen for click and drag events. @TODO drag
    $container.addEventListener('click', evt => {
        let $target = evt.target;
        if (! $target.id) $target = $target.parentNode;
        if (! $target.id) $target = $target.parentNode;

        // When a fieldset is clicked, toggle its minimisation.
        if (isFieldset($target)) toggleMinimisation($target);
    });

}


/* -------------------------- Private Class Helpers ------------------------- */

// Creates a <CHECKBOX> wrapped in a <LABEL>, based on a ‘step’ instruction.
function _buildBoolean(step) {
    const $el = document.createElement('label');
    $el.id = step.id.replace(/\./g, '-');
    $el.classList.add(`${CSS_PREFIX}row`,`${CSS_PREFIX}boolean`);
    const $identifier = document.createElement('span');
    $identifier.innerHTML = step.id.split('.').pop();
    $el.appendChild($identifier);
    const $input = document.createElement('input');
    $input.type = 'checkbox';
    $input.checked = step.initially;
    $el.appendChild($input);
    return $el;
}

// Creates a <FIELDSET> element, based on a ‘step’ instruction.
function _buildFieldset(step) {
    const $el = document.createElement('fieldset');
    $el.id = step.id.replace(/\./g, '-');
    $el.classList.add(`${CSS_PREFIX}fieldset`, `${CSS_PREFIX}depth-${step.depth}`);
    $el.style.height = `${step.height*30}px`;
    const $title = document.createElement('div');
    $title.classList.add(`${CSS_PREFIX}title`);
    $el.appendChild($title);
    const $arrow = document.createElement('span');
    $arrow.classList.add(`${CSS_PREFIX}arrow`);
    $arrow.innerText = '➤'; // BLACK RIGHTWARDS ARROWHEAD U+27A4
    $title.appendChild($arrow);
    $title.innerHTML += ` ${step.title}`;
    return $el;
}


/* ---------------------------------- Tests --------------------------------- */

// Tests render(). @TODO
export function testRender(expect, Formulate) {
    // expect().section('render()');
}
