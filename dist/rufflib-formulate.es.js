/**
 * rufflib-formulate 0.0.1
 * A RuffLIB library for transforming an object schema into an HTML form.
 * https://richplastow.com/rufflib-formulate
 * @license MIT
 */


/**
 * rufflib-validate 2.0.0
 * A RuffLIB library for succinctly validating JavaScript values.
 * https://richplastow.com/rufflib-validate
 * @license MIT
 */


// rufflib-validate/src/methods/_type.js

// Private method which runs simple validation based on `typeof`.
function _type(value, name, typeStr) {
    const type = typeof value;
    if (type === typeStr) return true;
    const n = typeof name === 'string'
        ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
            ? name
            : `'${name}'`
        : 'a value'
    ;
    this.err = value === null
        ? `${this.prefix}: ${n} is null not type '${typeStr}'`
        : Array.isArray(value)
            ? `${this.prefix}: ${n} is an array not type '${typeStr}'`
            : `${this.prefix}: ${n} is type '${type}' not '${typeStr}'`
    ;
    return false;
}

// rufflib-validate/src/methods/constants.js


/* -------------------------------- Constants ------------------------------- */

const A = 'array';
const B = 'boolean';
const F = 'function';
const I = 'integer';
const N = 'number';
const S = 'string';
const O = 'object';
const U = 'undefined';

// rufflib-validate/src/methods/_validateAgainstSchema.js

// Private method which runs recursive validation based on a `schema` object.
function _validateAgainstSchema(
    obj,     // the object to validate
    name,    // the `name` argument, passed in to the `object()` method
    schema,  // the schema to validate against
    path=[], // builds up a list of properties, as `_validateAgainstSchema()` recurses
) {

    // Do an `instanceof` test, if the `_meta` object contains an `inst` key.
    if (schema._meta.inst && ! (obj instanceof schema._meta.inst)) {
        if (! name && path.length === 0)
            this.err = `${this.prefix}: the top level object is not an instance of '${schema._meta.inst.name}'`;
        else if (! name)
            this.err = `${this.prefix}: '${path.join('.')}' of the top level object is not an instance of '${schema._meta.inst.name}'`;
        else if (path.length === 0)
            this.err = `${this.prefix}: '${name}' is not an instance of '${schema._meta.inst.name}'`;
        else
            this.err = `${this.prefix}: '${name}.${path.join('.')}' is not an instance of '${schema._meta.inst.name}'`;
        return false;
    }

    // Validate each key/value pair.
    for (let key in schema) {
        if (key === '_meta') continue; // ignore the special `_meta` property

        // Get handy shortcuts to the value to validate, and the schema object
        // used to validate it.
        const value = obj[key];
        const tv = typeof value;
        const sch = schema[key];

        // Call `_validateAgainstSchema()` recursively if this is a sub-schema.
        if (sch._meta) {
            if (value === null || tv !== O || Array.isArray(value)) {
                const fName = formatName(name, path, key);
                const n = fName.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
                    ? fName
                    : `'${fName}'`
                ;
                const type = value === null
                    ? 'null'
                    : tv !== O
                        ? `type '${tv}'`
                        : 'an array'
                ;
                this.err = `${this.prefix}: ${n} is ${type} not an object`;
                return false;
            }
            if (! this._validateAgainstSchema(value, name, sch, path.concat(key))) return false;
            continue;
        }

        // Skip validation if a fallback exists and the value is undefined.
        const tf = typeof sch.fallback;
        const tfnu = tf !== U;
        const tvu = tv === U;
        if (tfnu && tvu) continue;

        // Format the name.
        // @TODO improve the logic so `type()` doesn’t have to check for " of a value"
        const fName = formatName(name, path, key);

        // Deal with a value definition.
        switch (sch.kind) {
            case A: // array
                return '@TODO array';
            case B: // boolean
                if (! this.boolean(value, fName)) return false;
                continue;
            case I: // integer
            case N: // number
            case S: // string
                const tmaxnu = typeof sch.max !== U;
                const tminnu = typeof sch.min !== U;
                if (tmaxnu && tminnu) { // specifies min and max
                    if (! this[sch.kind](value, fName, sch.min, sch.max)) return false;
                } else if (tminnu) { // just specifies a minimum value
                    if (! this[sch.kind](value, fName, sch.min)) return false;
                } else if (tmaxnu) { // just specifies maximum value
                    if (! this[sch.kind](value, fName, undefined, sch.max)) return false;
                } else if (sch.rule) { // just specifies a rule (an object containing a `test()`)
                    if (! this[sch.kind](value, fName, sch.rule)) return false;
                } else if (sch.set) { // just specifies an array of valid values
                    if (! this[sch.kind](value, fName, sch.set)) return false;
                } else { // no qualifiers
                    if (! this[sch.kind](value, fName)) return false;
                }
                continue;
            default:
                this.err = 'oops!!';
                throw Error(this.err);
        }
    }

    return true; // signifies that `obj` is valid
}

function formatName(name, path, key) {
    const pk = path.concat(key).join('.');
    if (typeof name === U)
        return `'${pk}' of a value`
    return `${name}.${pk}`
}

// rufflib-validate/src/methods/array.js

// Public method which validates an array.
// If `validator` is specified, the array must contain a single type.
function array(value, name, ...args) {
    this.err = null;
    if (this.skip) return true;

    // Deal with a value which is not an array.
    if (! Array.isArray(value)) {
        const n = typeof name === 'string'
            ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
                ? name
                : `'${name}'`
            : 'a value'
        ;

        this.err = value === null
            ? `${this.prefix}: ${n} is null not an array`
            : `${this.prefix}: ${n} is type '${typeof value}' not an array`
        ;
        return false;
    }

    // Short-circuit if `args` is empty (only two arguments were supplied).
    const argsLen = args.length;
    if (! argsLen) return true;

    // Determine the meaning of `args`.
    let min = 0;
    let max = Infinity;
    let validator = null;
    let recursiveArgs = [];

    // There are nine correct `args` configurations.
    // That includes two configurations which produce ‘min and validator’:
    // 1. `args` is empty or all nullish - no min, max or validator
    // 2. `args[0]` is a number, and the rest of args is nullish - just min
    // 3. `args[0]` and `args[1]` are both numbers, rest of args nullish - min and max
    // 4. `args[0]` is nullish, `args[1]` is number, rest of args nullish - just max
    // 5. `args[0]` and `[1]` numbers, `[2]` function, rest anything - min, max and validator
    // 6. `args[0]` number, `[1]` nullish, `[2]` function, rest anything - min and validator
    // 7. `args[0]` nullish, `[1]` number, `[2]` function, rest anything - max and validator
    // 8. `args[0]` is a function, and the rest of args is anything - just validator
    // 9. `args[0]` is number, `[1]` is function, rest anything - min and validator
    const type0 = typeof args[0];
    const arg0 = type0 === 'function'
        ? 'fn'
        : type0 === 'number'
            ? 'num'
            : args[0] == null
                ? 'null' // could be `undefined` or `null`
                : 'other'
    ;
    const type1 = typeof args[1];
    const arg1 = type1 === 'function'
        ? 'fn'
        : type1 === 'number'
            ? 'num'
            : args[1] == null
                ? 'null'
                : 'other'
    ;
    const type2 = typeof args[2];
    const arg2 = type2 === 'function'
        ? 'fn'
        : type2 === 'number'
            ? 'num'
            : args[2] == null
                ? 'null'
                : 'other'
    ;

    switch (`${arg0},${arg1},${arg2}`) {
        // 1. `args` is empty or all nullish - no min, max or validator
        case 'null,null,null':
            for (let i=3; i<argsLen; i++) {
                if (args[i] != null) {
                    this.err = `Validate.array() incorrectly invoked 1: args[${i}] not nullish!`;
                    throw Error(this.err);    
                }
            }
            return true;
        // 2. `args[0]` is a number, and the rest of args is nullish - just min
        case 'num,null,null':
            for (let i=3; i<argsLen; i++) {
                if (args[i] != null) {
                    this.err = `Validate.array() incorrectly invoked 2: args[${i}] not nullish!`;
                    throw Error(this.err);    
                }
            }
            min = args[0];
            break;
        // 3. `args[0]` and `args[1]` are both numbers, rest of args nullish - min and max
        case 'num,num,null':
            for (let i=3; i<argsLen; i++) {
                if (args[i] != null) {
                    this.err = `Validate.array() incorrectly invoked 3: args[${i}] not nullish!`;
                    throw Error(this.err);    
                }
            }
            min = args[0];
            max = args[1];
            break;
        // 4. `args[0]` is nullish, `args[1]` is number, rest of args nullish - just max
        case 'null,num,null':
            for (let i=3; i<argsLen; i++) {
                if (args[i] != null) {
                    this.err = `Validate.array() incorrectly invoked 4: args[${i}] not nullish!`;
                    throw Error(this.err);    
                }
            }
            max = args[1];
            break;
        // 5. `args[0]` and `[1]` numbers, `[2]` function, rest anything - min, max and validator
        case 'num,num,fn':
            min = args[0];
            max = args[1];
            validator = args[2];
            recursiveArgs = args.slice(3);
            break;
        // 6. `args[0]` number, `[1]` nullish, `[2]` function, rest anything - min and validator
        case 'num,null,fn':
            min = args[0];
            validator = args[2];
            recursiveArgs = args.slice(3);
            break;
        // 7. `args[0]` nullish, `[1]` number, `[2]` function, rest anything - max and validator
        case 'null,num,fn':
            max = args[1];
            validator = args[2];
            recursiveArgs = args.slice(3);
            break;
        default:
            // 8. `args[0]` is a function, and the rest of args is anything - just validator
            if (arg0 === 'fn') {
                validator = args[0];
                recursiveArgs = args.slice(1);
            }
            // 9. `args[0]` is number, `[1]` is function, rest anything - min and validator
            else if (arg0 === 'num' && arg1 === 'fn') {
                min = args[0];
                validator = args[1];
                recursiveArgs = args.slice(2);
            }
            // Any other configuration is incorrect.
            else {
                this.err = `Validate.array() incorrectly invoked 5: args is not one of the nine configurations!`;
                throw Error(this.err);
            }

    }

    // Guard against ‘not-a-number’ bugs.
    if (Number.isNaN(min)) {
        this.err = 'Validate.array() incorrectly invoked: min is NaN!';
        throw Error(this.err);
    }
    if (Number.isNaN(max)) {
        this.err = 'Validate.array() incorrectly invoked: max is NaN!';
        throw Error(this.err);
    }

    // Validate the array length.
    if (value.length < min) {
        const nm = name ? `'${name}'` : 'array';
        this.err = `${this.prefix}: ${nm} length ${value.length} is < ${min}`;
        return false;
    }
    if (value.length > max) {
        const nm = name ? `'${name}'` : 'array';
        this.err = `${this.prefix}: ${nm} length ${value.length} is > ${max}`;
        return false;
    }

    // If `validator` is nullish, no more validation is needed.
    if (validator == null) return true;

    // Validate each element in the `value` array.
    const n = name ? name : '';
    for (let i=0, l=value.length; i<l; i++) {
        // console.log(value[i], `${n}[${i}]`, validator, this.err, result);
        if (! validator.bind(this)(value[i], `${n}[${i}]`, ...recursiveArgs))
            return false;
    }

    return true;
}

// rufflib-validate/src/methods/boolean.js

// Public method which validates boolean `true` or `false`.
function boolean(value, name) {
    this.err = null;
    if (this.skip) return true;

    return this._type(value, name, 'boolean')
}

// rufflib-validate/src/methods/class.js


/* --------------------------------- Method --------------------------------- */

// Public method which validates a class.
// Note the trailing underscore, because `class` is a reserved word in JavaScript.
function class_(value, name, schema) {
    this.err = null;
    if (this.skip) return true;

    typeof name === S
        ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
            ? name
            : `'${name}'`
        : 'a value'
    ;

    // Deal with a value which is not a function.
    if (! this._type(value, name, 'function')) return false;

    // Short-circuit if only two arguments were supplied.
    if (typeof schema === U) return true;

    // Check that the `schema` argument is correct.
    // @TODO optionally bypass this, when performance is important
    const isCorrect = this.schema(schema, 'schema');
    if (! isCorrect) throw Error(`Validate.class() incorrectly invoked: ${this.err}`);

    // Validate `value` against the `schema`.
    if (! this._validateAgainstSchema(value, name, schema)) return false;

    return true;
}

// rufflib-validate/src/methods/integer.js

// Public method which validates an integer like `10` or `-3.2e9`.
// Positive and negative infinity are not integers, and neither is `NaN`.
//
// `minSetOrRule` is optional, and allows either a minimum integer, a set of
// valid integers, or an object containing a `test()` function.
// If `minSetOrRule` is an integer, undefined or null, then (optional) `max` is
// the maximum valid integer.
function integer(value, name, minSetOrRule, max) {
    this.err = null;
    if (this.skip) return true;

    // If `value` is not a valid number, then it can’t be a valid integer.
    if (! this.number(value, name, minSetOrRule, max)) return false;

    // Otherwise, check that `value` is an integer.
    if (0 !== value % 1) {
        const n = typeof name === 'string'
            ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
                ? name
                : `'${name}'`
            : 'number'
        ;

        this.err = `${this.prefix}: ${n} ${value} is not an integer`;
        return false;
    }

    return true;
}

// rufflib-validate/src/methods/number.js

// Public method which validates a number like `10` or `-3.14`.
// Positive and negative infinity are numbers, but `NaN` is not.
//
// `minSetOrRule` is optional, and allows either a minimum number, a set of
// valid numbers, or an object containing a `test()` function.
// If `minSetOrRule` is a number, undefined or null, then (optional) `max` is
// the maximum valid number.
function number(value, name, minSetOrRule, max) {
    this.err = null;
    if (this.skip) return true;

    // Deal with the simple cases where `value` is not a valid number.
    if (! this._type(value, name, 'number')) return false;
    if (Number.isNaN(value)) {
        this.err = `${this.prefix}: '${name}' is NaN, not a valid number`;
        return false;
    }

    const msorIsObj = typeof minSetOrRule === 'object' && minSetOrRule != null;
    const n = typeof name === 'string'
        ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
            ? name
            : `'${name}'`
        : 'number'
    ;

    // If `minSetOrRule` is an array, treat it as a set of valid numbers.
    if (msorIsObj && Array.isArray(minSetOrRule)) {
        if (-1 !== minSetOrRule.indexOf(value)) return true;
        let arr = `[${minSetOrRule}]`;
        arr = arr.length < 21 ? arr : `${arr.slice(0,12)}...${arr.slice(-5)}`;
        this.err = `${this.prefix}: ${n} ${value} is not in ${arr}`;
        return false;
    }

    // If `minSetOrRule` is a rule, run the test function.
    if (msorIsObj && typeof minSetOrRule.test === 'function') {
        if (minSetOrRule.test(value)) return true;
        let tst = `${minSetOrRule.test}`;
        tst = tst.length < 21 ? tst : `${tst.slice(0,12)}...${tst.slice(-5)}`;
        this.err = `${this.prefix}: ${n} ${value} fails ${tst}`;
        return false;
    }

    // If `minSetOrRule` is a valid number, treat it as the minimum valid number.
    if (typeof minSetOrRule === 'number') {
        const min = minSetOrRule;
        if (Number.isNaN(min)) {
            this.err = 'Validate.number() incorrectly invoked: min is NaN!';
            throw Error(this.err);
        }
        if (value < min) {
            this.err = `${this.prefix}: ${n} ${value} is < ${min}`;
            return false;
        }
    }

    // Here, `minSetOrRule` can be ignored. If `max` is a valid number, treat it
    // as the minimum valid number.
    if (typeof max === 'number') {
        if (Number.isNaN(max)) {
            this.err = 'Validate.number() incorrectly invoked: max is NaN!';
            throw Error(this.err);
        }
        if (value > max) {
            this.err = `${this.prefix}: ${n} ${value} is > ${max}`;
            return false;
        }
    }

    // The number is valid, yay!
    return true;
}

// rufflib-validate/src/methods/object.js


/* --------------------------------- Method --------------------------------- */

// Public method which validates a plain object.
function object(value, name, schema) {
    this.err = null;
    if (this.skip) return true;

    const n = typeof name === S
        ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
            ? name
            : `'${name}'`
        : 'a value'
    ;

    // Deal with a value which is not a plain object.
    if (value === null) {
        this.err = `${this.prefix}: ${n} is null not an object`;
        return false;
    }
    if (Array.isArray(value)) {
        this.err = `${this.prefix}: ${n} is an array not an object`;
        return false;
    }
    if (! this._type(value, name, 'object')) return false;

    // Short-circuit if only two arguments were supplied.
    if (typeof schema === U) return true;

    // Check that the `schema` argument is correct.
    // @TODO optionally bypass this, when performance is important
    const isCorrect = this.schema(schema, 'schema');
    if (! isCorrect) throw Error(`Validate.object() incorrectly invoked: ${this.err}`);

    // Validate `value` against the `schema`.
    if (! this._validateAgainstSchema(value, name, schema)) return false;

    return true;
}

// rufflib-validate/src/methods/schema.js


/* --------------------------------- Method --------------------------------- */

// Public method which validates a schema object.
// The optional `metaSchema` argument defines properties which `_meta` objects
// must contain. If `metaSchema` is omitted, `_meta` can be an empty object.
function schema(value, name, metaSchema) {
    this.err = null;
    if (this.skip) return true;

    // If present, check that the `metaSchema` is a plain object.
    if (typeof metaSchema !== U) {
        if (metaSchema === null || typeof metaSchema !== O || Array.isArray(metaSchema)) {
            const is = getIs(metaSchema);
            throw Error(`Validate.schema() incorrectly invoked: ${this.prefix}: `
                + `optional 'metaSchema' is ${is} not an object`);
        }
    }

    // Recursively check that `value` is a correct `schema`.
    const err = checkSchemaCorrectness(value, name, [], metaSchema, this);
    if (err) {
        this.err = `${this.prefix}: ${err}`;
        return false;
    }

    return true;
}


/* --------------------------------- Helpers -------------------------------- */

// Checks that a given `schema` object is correctly formed.
// Returns a string if the schema is incorrect, or `null` if it’s correct.
// @TODO guard against cyclic objects
// @TODO make this into a private method, _checkSchemaCorrectness(), to avoid `that`
function checkSchemaCorrectness(sma, name, path, metaSchema, that) {

    // Check that the `schema` is a plain object.
    if (sma === null || typeof sma !== O || Array.isArray(sma)) {
        const is = getIs(sma);
        if (! name && path.length === 0)
            return `the schema is ${is} not an object`;
        if (! name)
            return `'${path.join('.')}' of the schema is ${is} not an object`;
        if (path.length === 0)
            return `'${name}' is ${is} not an object`;
        return `'${name}.${path.join('.')}' is ${is} not an object`;
    }

    // Check that its `_meta` value is a plain object.
    const _meta = sma._meta;
    if (_meta === null || typeof _meta !== O || Array.isArray(_meta)) {
        const is = getIs(_meta);
        if (! name && path.length === 0)
            return `top level '_meta' of the schema is ${is} not an object`;
        if (! name)
            return `'${path.join('.')}._meta' of the schema is ${is} not an object`;
        if (path.length === 0)
            return `'${name}._meta' is ${is} not an object`;
        return `'${name}.${path.join('.')}._meta' is ${is} not an object`;
    }

    // If the special `_meta.inst` value exists, chack that it is an object with
    // a `name` property.
    const inst = sma._meta.inst;
    if (typeof inst !== 'undefined') {
        if (inst === null || typeof inst !== F || Array.isArray(inst)) {
            const is = getIs(inst);
            if (! name && path.length === 0)
                return `top level '._meta.inst' of the schema is ${is} not type 'function'`;
            if (! name)
                return `'${path.join('.')}._meta.inst' of the schema is ${is} not type 'function'`;
            if (path.length === 0)
                return `'${name}._meta.inst' is ${is} not type 'function'`;
            return `'${name}.${path.join('.')}._meta.inst' is ${is} not type 'function'`;
        }
        if (typeof inst.name !== 'string') {
            const is = getIs(inst.name);
            if (! name && path.length === 0)
                return `top level '._meta.inst.name' of the schema is ${is} not 'string'`;
            if (! name)
                return `'${path.join('.')}._meta.inst.name' of the schema is ${is} not 'string'`;
            if (path.length === 0)
                return `'${name}._meta.inst.name' is ${is} not 'string'`;
            return `'${name}.${path.join('.')}._meta.inst.name' is ${is} not 'string'`;
        }
    }

    // Use `metaSchema` (if provided) to validate the `_meta` object.
    // @TODO

    // Check each key/value pair.
    for (let key in sma) {
        // Every value must be a plain object.
        const value = sma[key];
        if (value === null || typeof value !== O || Array.isArray(value)) {
            return fmtErr(name, path, key, `is ${getIs(value)} not an object`);
        }

        // Validate the special `_meta` property.
        if (key === '_meta') {
            if (metaSchema) {
                const n = name && path.length
                    ? `${name}.${path.join('.')}._meta`
                    : name
                        ? `${name}._meta`
                        : path.length
                            ? `${path.join('.')}._meta`
                            : `top level _meta`;
                if (! that.object(value, n, metaSchema))
                    return that.err.slice(that.prefix.length + 2);
            }
            continue;
        }

        // Deal with a sub-schema.
        if (value._meta) {
            const err = checkSchemaCorrectness(value, name, [...path, key], metaSchema, that);
            if (err) return err;
            continue;
        }

        // Schema value properties are never allowed to be `null`.
        if (value.fallback === null)
            return fmtErr(name, path, key, `is null`, 'fallback');
        if (value.max      === null)
            return fmtErr(name, path, key, `is null`, 'max');
        if (value.min      === null)
            return fmtErr(name, path, key, `is null`, 'min');
        if (value.rule     === null)
            return fmtErr(name, path, key, `is null`, 'rule');
        if (value.set      === null)
            return fmtErr(name, path, key, `is null`, 'set');

        // Get handy shortcuts to schema value properties, and whether they’re undefined.
        const tf     = Array.isArray(value.fallback) ? A : typeof value.fallback;
        const tmax   = Array.isArray(value.max)      ? A : typeof value.max;
        const tmin   = Array.isArray(value.min)      ? A : typeof value.min;
        const tr     = Array.isArray(value.rule)     ? A : typeof value.rule;
        const ts     = Array.isArray(value.set)      ? A : typeof value.set;
        const tfnu   = tf   !== U;
        const tmaxnu = tmax !== U;
        const tminnu = tmin !== U;
        const trnu   = tr   !== U;
        const tsnu   = ts   !== U;

        // Only one of `max`, `min`, `rule` and `set` is allowed to exist...
        const qnum = tmaxnu + tminnu + trnu + tsnu;
        if (qnum > 1)
            if (qnum !== 2 || !tmaxnu || !tminnu) // ...apart from the min/max pair
                return fmtErr(name, path, key, `has '${qnum}' qualifiers, only 0 or 1 allowed`);

        // Deal with a value definition.
        const vk = value.kind;
        switch (vk) {
            case A: // array
                return '@TODO array';
            case B: // boolean
                if (tf !== B && tfnu) return fmtErr( // undefined fallback means value is mandatory
                    name, path, key, `has '${tf}' fallback, not '${B}' or '${U}'`);
                if (tmaxnu) return fmtErr(
                    name, path, key, `has '${tmax}' max, not '${U}'`);
                if (tminnu) return fmtErr(
                    name, path, key, `has '${tmin}' min, not '${U}'`);
                if (trnu) return fmtErr(
                    name, path, key, `has '${tr  }' rule, not '${U}'`);
                if (tsnu) return fmtErr(
                    name, path, key, `has '${ts  }' set, not '${U}'`);
                break;
            case I: // integer
            case N: // number
                if (tf !== N && tfnu) return fmtErr(
                    name, path, key, `has '${tf}' fallback, not '${N}' or '${U}'`);
                if (tmax !== N && tmaxnu) return fmtErr(
                    name, path, key, `has '${tmax}' max, not '${N}' or '${U}'`);
                if (tmin !== N && tminnu) return fmtErr(
                    name, path, key, `has '${tmin}' min, not '${N}' or '${U}'`);
                if (tr === O) {
                    const trt = typeof value.rule.test;
                    if (trt !== 'function') return fmtErr(
                        name, path, key, `has '${trt}' rule.test, not 'function'`);
                } else if (trnu) return fmtErr(
                    name, path, key, `has '${tr}' rule, not '${O}' or '${U}'`);
                if (ts === A) {
                    for (let i=0,l=value.set.length; i<l; i++) {
                        const tsi = typeof value.set[i];
                        if (tsi !== N) return fmtErr(
                            name, path, key, `has '${tsi}' set[${i}], not '${N}'`);
                    }
                } else if (tsnu) return fmtErr(
                    name, path, key, `has '${ts}' set, not an array or '${U}'`);
                break;
            case S: // string
                if (tf !== S && tfnu) return fmtErr(
                    name, path, key, `has '${tf}' fallback, not '${S}' or '${U}'`);
                if (tmax !== N && tmaxnu) return fmtErr(
                    name, path, key, `has '${tmax}' max, not '${N}' or '${U}'`);
                if (tmin !== N && tminnu) return fmtErr(
                    name, path, key, `has '${tmin}' min, not '${N}' or '${U}'`);
                if (tr === O) {
                    const trt = typeof value.rule.test;
                    if (trt !== 'function') return fmtErr(
                        name, path, key, `has '${trt}' rule.test, not 'function'`);
                } else if (trnu) return fmtErr(
                    name, path, key, `has '${tr}' rule, not '${O}' or '${U}'`);
                if (ts === A) {
                    for (let i=0,l=value.set.length; i<l; i++) {
                        const tsi = typeof value.set[i];
                        if (tsi !== S) return fmtErr(
                            name, path, key, `has '${tsi}' set[${i}], not '${S}'`);
                    }
                } else if (tsnu) return fmtErr(
                    name, path, key, `has '${ts}' set, not an array or '${U}'`);
                break;
            default:
                // if (! name)
                //     return `'${pks}.kind' of the schema not recognised`;
                // return `'${name}.${pks}.kind' not recognised`;
                return fmtErr(name, path, key, 'not recognised', 'kind');

        }
    }

    return null; // signifies a correct schema
}

// Formats an error message.
function fmtErr(
    name,    // the original `name` argument
    path,    // array containing path-segment strings
    key,     // path-segment to add between `path` and `end`
    body, // the main body of the error
    pathEnd, // [optional] path-segment to tack onto the end
) {
    return `'${name ? name+'.' : ''
        }${path.length === 0 ? '' : path.join('.')+'.'
        }${key ? key : ''
        }${pathEnd ? '.'+pathEnd : ''
        }'${name ? '' : ' of the schema'
        } ${body}`
    ;
}

// Returns a description of the type of a value.
function getIs(value) {
    return value === null
        ? 'null'
        : Array.isArray(value)
            ? 'an array'
            : `type '${typeof value}'`
    ;

}

// rufflib-validate/src/methods/string.js

// Public method which validates a string like "Abc" or "".
//
// `minSetOrRule` is optional, and allows either a minimum string length, a set
// of valid strings (for enums), or an object containing a `test()` function.
// Note that JavaScript RegExps are objects which contain a `test()` function.
// If `minSetOrRule` is a number, undefined or null, then (optional) `max` is
// the maximum valid string length.
function string(value, name, minSetOrRule, max) {
    this.err = null;
    if (this.skip) return true;

    // Deal with the simple cases where `value` is not a valid string.
    if (! this._type(value, name, 'string')) return false;

    const msorIsObj = typeof minSetOrRule === 'object' && minSetOrRule != null;
    const n = typeof name === 'string'
        ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
            ? name
            : `'${name}'`
        : 'string'
    ;

    // If `minSetOrRule` is an array, treat it as a set of valid strings.
    // This is a handy way of validating an enum.
    if (msorIsObj && Array.isArray(minSetOrRule)) {
        if (-1 !== minSetOrRule.indexOf(value)) return true;
        let val = `"${value}"`;
        val = val.length < 21 ? val : `${val.slice(0,12)}...${val.slice(-5)}`;
        let arr = `[${minSetOrRule}]`;
        arr = arr.length < 21 ? arr : `${arr.slice(0,12)}...${arr.slice(-5)}`;
        this.err = `${this.prefix}: ${n} ${val} is not in ${arr}`;
        return false;
    }

    // If `minSetOrRule` is a rule, run the test function.
    if (msorIsObj && typeof minSetOrRule.test === 'function') {
        if (minSetOrRule.test(value)) return true;
        let val = `"${value}"`;
        val = val.length < 21 ? val : `${val.slice(0,12)}...${val.slice(-5)}`;
        let tst = `${minSetOrRule instanceof RegExp ? minSetOrRule : minSetOrRule.test}`;
        tst = tst.length < 21 ? tst : `${tst.slice(0,12)}...${tst.slice(-5)}`;
        this.err = `${this.prefix}: ${n} ${val} fails ${tst}`;
        return false;
    }

    // If `minSetOrRule` is a valid number, treat it as the minimum valid number.
    if (typeof minSetOrRule === 'number') {
        const min = minSetOrRule;
        if (Number.isNaN(min)) {
            this.err = 'Validate.string() incorrectly invoked: min is NaN!';
            throw Error(this.err);
        }
        if (value.length < min) {
            this.err = `${this.prefix}: ${n} length ${value.length} is < ${min}`;
            return false;
        }
    }

    // Here, `minSetOrRule` can be ignored. If `max` is a valid number, treat it
    // as the minimum valid number.
    if (typeof max === 'number') {
        if (Number.isNaN(max)) {
            this.err = 'Validate.string() incorrectly invoked: max is NaN!';
            throw Error(this.err);
        }
        if (value.length > max) {
            this.err = `${this.prefix}: ${n} length ${value.length} is > ${max}`;
            return false;
        }
    }

    // The string is valid, yay!
    return true;
}

// rufflib-validate/src/validate.js

// Assembles the `Validate` class.


/* --------------------------------- Import --------------------------------- */

const NAME$1 = 'Validate';
const VERSION$1 = '2.0.0';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for succinctly validating JavaScript values.
//
// Typical usage:
//
//     import Validate from 'rufflib-validate';
//
//     function sayOk(n, allowInvalid) {
//         const v = new Validate('sayOk()', allowInvalid);
//         if (!v.number(n, 'n', 100)) return v.err;
//         return 'ok!';
//     }
//     
//     sayOk(123); // ok!
//     sayOk(null); // sayOk(): 'n' is null not type 'number'
//     sayOk(3); // 'n' 3 is < 100
//     sayOk(3, true); // ok! (less safe, but faster)
//
class Validate {
    static name = NAME$1; // make sure minification doesn’t squash the `name` property
    static VERSION = VERSION$1;

    constructor (prefix, skip) {
        this.err = null;
        this.prefix = prefix || '(anon)';
        this.skip = skip || false;
    }

}

Validate.prototype._type = _type;
Validate.prototype._validateAgainstSchema = _validateAgainstSchema;

Validate.prototype.array = array;
Validate.prototype.boolean = boolean;
Validate.prototype.class = class_;
Validate.prototype.integer = integer;
Validate.prototype.number = number;
Validate.prototype.object = object;
Validate.prototype.schema = schema;
Validate.prototype.string = string;

// rufflib-formulate/src/helpers/constants.js


/* -------------------------------- Constants ------------------------------- */

const NAME = 'Formulate';
const VERSION = '0.0.1';

const CSS_PREFIX = 'rl_f-'; // should have trailing '-'
const ID_PREFIX = 'rl_f'; // should NOT have trailing '-'

const RX_IDENTIFIER = /^[_a-z][_0-9a-z]*$/;
const RX_META_TITLE = /^[-_ 0-9a-z]{1,32}$/i;
const RX_PATH =       /^[_a-z][._0-9a-z]{0,254}$/;

// rufflib-formulate/src/helpers/build-render-instructions.js


/* -------------------------- Public Class Helpers -------------------------- */

// Transforms a Formulate schema and path into a list of steps. Each step is
// either an instruction for creating an HTML element, or the special
// 'fieldsetUp' instruction.
function buildRenderInstructions(schema, path=ID_PREFIX, depth=1, skipValidation=false) {

    // Validate the constructor arguments, unless `skipValidation` is true.
    // Note that `v.schema()` is already recursive, so only needs running once.
    const v = new Validate('buildRenderInstructions()', skipValidation);
    if (depth === 1 && ! v.schema(schema, `(schema) ${path}`))
        return { error:v.err };
    if (! v.object(schema._meta, `(schema) ${path}._meta`, {
            _meta:{}, title:{ kind:'string', rule:RX_META_TITLE } })
     || ! v.string(path, 'path', RX_PATH)
     || ! v.integer(depth, 'depth', 1, 3) // maximum three levels deep @TODO consider increasing this
    ) return { error:v.err };

    // Create a list of steps. The first step is always an instruction to render
    // a <FIELDSET> element.
    const steps = [{
        depth,
        height: 1,
        id: path,
        kind: 'fieldsetDown',
        title: schema._meta.title,
    }];
    const fieldsetDownRef = steps[0];

    // Step through each property in the schema object.
    for (let key in schema) {
        const val = schema[key];
        const { initially, kind } = val;

        // Ignore the `_meta` object.
        if (key === '_meta') continue;

        // If the value contains a 'kind' property, build an instruction for
        // rendering a field.
        if (kind) {
            const id = `${path}.${key}`;
            const v = new Validate('buildRenderInstructions()', skipValidation);
            if (! v.string(key, 'key', RX_IDENTIFIER) // must not contain a dot
             || ! v[kind](initially, `${id}.initially`)
             || ! v.string(id, 'id', RX_PATH) // must be be too long
            ) return { error:v.err };
            steps.push({ id, initially, kind });
            fieldsetDownRef.height++;
            continue;
        }

        // The value does not contain a 'kind' property, so build an instruction
        // for rendering a sub-fieldset.
        const result = buildRenderInstructions(
            val, // `val` should be a sub-schema
            `${path}.${key}`, // the path is dot-delimited
            depth + 1, // recurse down a level
            skipValidation, // some of the validation needs doing on each recurse
        );
        if (result.error) return result;
        const subSteps = result.steps;
        fieldsetDownRef.height += subSteps[0].height;
        steps.push(...subSteps); // spread syntax, keeps the array 1 dimensional
    }

    // The last step is an instruction that the <FIELDSET> element at `steps[0]`
    // has ended. Everything between the first and last instruction should be
    // nested inside that <FIELDSET> element.
    steps.push({ kind:'fieldsetUp' });
    return { steps };
}

// rufflib-formulate/src/helpers/dom-helpers.js


/* --------------------------- Public DOM Helpers --------------------------- */

// Maximises a minimised, or minimises a maximised <FIELDSET>.
function toggleMinimisation($target) {
    if (_isMin($target)) {
        _maximise($target);
    } else {
        _minimise($target);
    }
}

// Syntactic sugar for identifying an element by its class attribute.
function isFieldset($el) {
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

// rufflib-formulate/src/helpers/render.js


/* -------------------------- Public Class Helpers -------------------------- */

// Creates various elements, based on ‘step’ instructions.
function render($container, steps) {
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

// rufflib-formulate/src/formulate.js


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for transforming an object schema into an HTML form.
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
class Formulate {
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

// rufflib-formulate/src/entry-point-main.js

export { Formulate as default };
