// rufflib-formulate/src/demo-1.js

// The ‘main’ file for bundling the 1st Formulate demo.

// Runs ‘Demo 1’.
export default function formulateDemo1(Formulate) {
    const $log = document.querySelector('#log');
    const $form0 = document.querySelector('#form-0');
    const $form1 = document.querySelector('#form-1');
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
    }
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
    }
    new Formulate($form1, 'schema1', schema1);
}
