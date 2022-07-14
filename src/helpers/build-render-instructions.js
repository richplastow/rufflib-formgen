// rufflib-formulate/src/helpers/build-render-instructions.js


/* --------------------------------- Import --------------------------------- */

import Validate from 'rufflib-validate';

import { ID_PREFIX, RX_IDENTIFIER, RX_META_TITLE, RX_PATH } from './constants.js';


/* -------------------------- Public Class Helpers -------------------------- */

// Transforms a Formulate schema and path into a list of steps (instructions for
// creating HTML elements). Also, gets the maximised height.
export function buildRenderInstructions(schema, path=ID_PREFIX, depth=1, skipValidation=false) {

    // Validate the constructor arguments, unless `skipValidation` is true.
    const v = new Validate('buildRenderInstructions()', skipValidation);
    if (! v.schema(schema, `${path}.schema`)
     || ! v.object(schema._meta, `${path}.schema._meta`, {
            _meta:{}, title:{ kind:'string', rule:RX_META_TITLE } })
     || ! v.string(path, 'path', RX_PATH)
     || ! v.integer(depth, 'depth', 1)
    ) return { error:v.err };

    const steps = [];
    const fieldsetDown = {
        kind: 'fieldsetDown',
        title: schema._meta.title,
    };
    fieldsetDown.id = path;
    steps.push(fieldsetDown);
    let height = 1; // in lines

    for (let identifier in schema) {
        const obj = schema[identifier];
        if (typeof obj !== 'object' || obj === null) throw Error('!');
        if (identifier === '_meta') continue;
        if (obj.kind) {
            if (! RX_IDENTIFIER.test(identifier)) return { error:
                `buildRenderInstructions(), '${identifier}' in '${path}' fails ${RX_IDENTIFIER}` }
            obj.identifier = identifier;
            obj.id = `${path}.${identifier}`;
            steps.push(obj);
            height++;
        } else {
            const result = buildRenderInstructions(
                obj, `${path}.${identifier}`, depth+1, false);
            if (result.error) return result;
            const { height:subHeight, steps:subSteps } = result;
            height += subHeight;
            steps.push(...subSteps);
        }
    }
    fieldsetDown.depth = depth;
    fieldsetDown.height = height;
    steps.push({ kind:'fieldsetUp' });
    return { height, steps };
}


/* ---------------------------------- Tests --------------------------------- */

// Tests buildRenderInstructions().
export function testBuildRenderInstructions(expect) {
    expect().section('buildRenderInstructions()');

    const funct = buildRenderInstructions;
    const nm = 'buildRenderInstructions';

    // Is a function, with skippable validation.
    expect(`typeof ${nm}`,
            typeof funct).toBe('function');
    expect(`${nm}({_meta:{title:'Abc'}}, 'xyz', 0, true)`,
            funct({_meta:{title:'Abc'}}, 'xyz', 0, true)).toJson({
                error: undefined,
                height: 1,
                steps: [
                    { kind:'fieldsetDown', title:'Abc', id:'xyz', depth:0, height:1 },
                    { kind:'fieldsetUp'}
                ]
            });

    // Invalid arguments.
    expect(`${nm}()`,
            funct()).toError(
            `${nm}(): 'rl_f.schema' is type 'undefined' not an object`);
    expect(`${nm}({})`,
            funct({})).toError(
            `${nm}(): 'rl_f.schema._meta' is type 'undefined' not an object`);
    expect(`${nm}({_meta:{}})`,
            funct({_meta:{}})).toError(
            `${nm}(): 'rl_f.schema._meta.title' is type 'undefined' not 'string'`);
    expect(`${nm}({_meta:{title:'Abc'}}, 123)`,
            funct({_meta:{title:'Abc'}}, 123)).toError(
            `${nm}(): 'path' is type 'number' not 'string'`);
    expect(`${nm}({_meta:{title:'Abc'}}, 'xy-z')`,
            funct({_meta:{title:'Abc'}}, 'xy-z')).toError(
            `${nm}(): 'path' "xy-z" fails /^[_a-z][._0...z]*$/`);
    expect(`${nm}({_meta:{title:'Abc'}}, 'xyz', 1.5)`,
            funct({_meta:{title:'Abc'}}, 'xyz', 1.5)).toError(
            `${nm}(): 'depth' 1.5 is not an integer`);
    expect(`${nm}({_meta:{title:'Abc'}}, 'xyz', 0)`,
            funct({_meta:{title:'Abc'}}, 'xyz', 0)).toError(
            `${nm}(): 'depth' 0 is < 1`);

    // Invalid schema. @TODO more of these
    expect(`${nm}({_meta:{title:'A'},café:{kind:'boolean'}})`,
            funct({_meta:{title:'A'},café:{kind:'boolean'}})).toError(
            `${nm}(), 'café' in 'rl_f' fails /^[_a-z][_0-9a-z]*$/`);


    // Basic usage.
    expect(`${nm}({_meta:{title:'Abc'}}, 'xyz', 1)`,
            funct({_meta:{title:'Abc'}}, 'xyz', 1)).toJson({
                error: undefined,
                height: 1,
                steps: [
                    { kind:'fieldsetDown', title:'Abc', id:'xyz', depth:1, height:1 },
                    { kind:'fieldsetUp' }
                ]
            });
    expect(`${nm}({a:{kind:'boolean'},_meta:{title:'Abc'}})`,
            funct({a:{kind:'boolean'},_meta:{title:'Abc'}})).toJson({
                height: 2,
                steps: [
                    { kind:'fieldsetDown', title:'Abc', id:ID_PREFIX, depth:1, height:2 },
                    { kind:'boolean', identifier:'a', id:ID_PREFIX+'.a' },
                    { kind:'fieldsetUp' }
                ]
            });
    expect(`${nm}({sub:{_meta:{title:'Sub'},_:{kind:'boolean'}},outer:{kind:'boolean'},_meta:{title:'Abc'}}, 'id')`,
            funct({sub:{_meta:{title:'Sub'},_:{kind:'boolean'}},outer:{kind:'boolean'},_meta:{title:'Abc'}}, 'id')).toJson({
                height: 4,
                steps: [
                    { kind: 'fieldsetDown', title: 'Abc', id: 'id', depth: 1, height: 4 },
                    { kind: 'fieldsetDown', title: 'Sub', id: 'id.sub', depth: 2, height: 2 },
                    { kind: 'boolean', identifier: '_', id: 'id.sub._' },
                    { kind: 'fieldsetUp' },
                    { kind: 'boolean', identifier: 'outer', id: 'id.outer' },
                    { kind: 'fieldsetUp' }
                ]
            });

}
