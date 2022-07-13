// Configuration, used by `rollup -c` during `npm run build`.

import { homepage, description, license, name, version }
    from './package.json';
import { babel } from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const banner = `/**\n`
    + ` * ${name} ${version}\n` // will be ' * Unit tests for ...' in test files
    + ` * ${description}\n`
    + ` * ${homepage}\n`
    + ` * @license ${license}\n`
    + ` */\n\n`;

export default [

    // Build Formulate’s distribution files. Tree-shaking should remove all tests.
    {
        input: 'src/entry-point-main.js',
        output: {
            banner,
            file: 'docs/dist/rufflib-formulate.es.js',
            format: 'es', // eg for `node docs/run-nodejs-tests.js`
        },
        plugins: [nodeResolve({ resolveOnly:['rufflib-validate'] })]
    },
    {
        input: 'docs/dist/rufflib-formulate.es.js',
        output: {
            file: 'docs/dist/rufflib-formulate.umd.es5.min.js',
            format: 'umd', // eg for `docs/index.html` in legacy browsers
            name: 'rufflib.formulate.main', // `var Formulate = rufflib.formulate.main`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        // and https://github.com/terser/terser#minify-options
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            terser({ keep_classnames:true })
        ]
    },

    // Build demo files.
    // {
    //     input: 'src/demo-1.js',
    //     output: {
    //         banner: banner.replace(' * ', ' * Demo 1 for '),
    //         file: 'docs/dist/rufflib-formulate-demo-1.es.js',
    //         format: 'es',
    //     }
    // },
    {
        input: 'src/demo-1.js',
        output: {
            banner: banner.replace(' * ', ' * Demo 1 for '),
            file: 'docs/dist/rufflib-formulate-demo-1.umd.js',
            format: 'umd', // eg for `docs/demo-1.html` in legacy browsers
            name: 'rufflib.formulate.demo1' // `rufflib.formulate.demo1(Formulate)`
        },
        plugins: [
            babel({ babelHelpers: 'bundled' })
        ]
    },

    // Build unit test distribution files.
    {
        input: 'src/entry-point-for-tests.js',
        output: {
            banner: banner.replace(' * ', ' * Unit tests for '),
            file: 'docs/dist/rufflib-formulate-test.es.js',
            format: 'es', // eg for `node docs/run-nodejs-tests.js`
        },
        plugins: [nodeResolve({ resolveOnly:['rufflib-validate'] })]
    },
    {
        input: 'docs/dist/rufflib-formulate-test.es.js',
        output: {
            file: 'docs/dist/rufflib-formulate-test.umd.js',
            format: 'umd', // eg for `docs/run-browser-tests.html` in legacy browsers
            name: 'rufflib.formulate.test' // `rufflib.formulate.test(expect, Formulate)`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            copy({
                targets: [{
                    src: 'node_modules/rufflib-expect/docs/dist/rufflib-expect.umd.es5.min.js',
                    dest: 'docs/lib'
                }]
            }),
        ]
    }
];
