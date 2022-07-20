(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.rufflib = global.rufflib || {}, global.rufflib.formulate = global.rufflib.formulate || {}, global.rufflib.formulate.test = factory()));
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * Unit tests for rufflib-formulate 0.0.1
   * A RuffLIB library for transforming an object schema into an HTML form.
   * https://richplastow.com/rufflib-formulate
   * @license MIT
   */

  /**
   * rufflib-validate 1.3.0
   * A RuffLIB library for succinctly validating JavaScript values.
   * https://richplastow.com/rufflib-validate
   * @license MIT
   */
  // rufflib-validate/src/methods/_type.js
  // Private method which runs simple validation based on `typeof`.
  function _type(value, name, typeStr) {
    var type = _typeof(value);

    if (type === typeStr) return true;
    var n = typeof name === 'string' ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
    ? name : "'".concat(name, "'") : 'a value';
    this.err = value === null ? "".concat(this.prefix, ": ").concat(n, " is null not type '").concat(typeStr, "'") : Array.isArray(value) ? "".concat(this.prefix, ": ").concat(n, " is an array not type '").concat(typeStr, "'") : "".concat(this.prefix, ": ").concat(n, " is type '").concat(type, "' not '").concat(typeStr, "'");
    return false;
  } // rufflib-validate/src/methods/constants.js

  /* -------------------------------- Constants ------------------------------- */


  var A = 'array';
  var B = 'boolean';
  var F = 'function';
  var I = 'integer';
  var N = 'number';
  var S = 'string';
  var O = 'object';
  var U = 'undefined'; // rufflib-validate/src/methods/_validateAgainstSchema.js
  // Private method which runs recursive validation based on a `schema` object.

  function _validateAgainstSchema(obj, // the object to validate
  name, // the `name` argument, passed in to the `object()` method
  schema) {
    var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    // Do an `instanceof` test, if the `_meta` object contains an `inst` key.
    if (schema._meta.inst && !(obj instanceof schema._meta.inst)) {
      if (!name && path.length === 0) this.err = "".concat(this.prefix, ": the top level object is not an instance of '").concat(schema._meta.inst.name, "'");else if (!name) this.err = "".concat(this.prefix, ": '").concat(path.join('.'), "' of the top level object is not an instance of '").concat(schema._meta.inst.name, "'");else if (path.length === 0) this.err = "".concat(this.prefix, ": '").concat(name, "' is not an instance of '").concat(schema._meta.inst.name, "'");else this.err = "".concat(this.prefix, ": '").concat(name, ".").concat(path.join('.'), "' is not an instance of '").concat(schema._meta.inst.name, "'");
      return false;
    } // Validate each key/value pair.


    for (var key in schema) {
      if (key === '_meta') continue; // ignore the special `_meta` property
      // Get handy shortcuts to the value to validate, and the schema object
      // used to validate it.

      var value = obj[key];

      var tv = _typeof(value);

      var sch = schema[key]; // Call `_validateAgainstSchema()` recursively if this is a sub-schema.

      if (sch._meta) {
        if (value === null || tv !== O || Array.isArray(value)) {
          var _fName = formatName(name, path, key);

          var n = _fName.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
          ? _fName : "'".concat(_fName, "'");
          var type = value === null ? 'null' : tv !== O ? "type '".concat(tv, "'") : 'an array';
          this.err = "".concat(this.prefix, ": ").concat(n, " is ").concat(type, " not an object");
          return false;
        }

        if (!this._validateAgainstSchema(value, name, sch, path.concat(key))) return false;
        continue;
      } // Skip validation if a fallback exists and the value is undefined.


      var tf = _typeof(sch.fallback);

      var tfnu = tf !== U;
      var tvu = tv === U;
      if (tfnu && tvu) continue; // Format the name.
      // @TODO improve the logic so `type()` doesn’t have to check for " of a value"

      var fName = formatName(name, path, key); // Deal with a value definition.

      switch (sch.kind) {
        case A:
          // array
          return '@TODO array';

        case B:
          // boolean
          if (!this["boolean"](value, fName)) return false;
          continue;

        case I: // integer

        case N: // number

        case S:
          // string
          var tmaxnu = _typeof(sch.max) !== U;
          var tminnu = _typeof(sch.min) !== U;

          if (tmaxnu && tminnu) {
            // specifies min and max
            if (!this[sch.kind](value, fName, sch.min, sch.max)) return false;
          } else if (tminnu) {
            // just specifies a minimum value
            if (!this[sch.kind](value, fName, sch.min)) return false;
          } else if (tmaxnu) {
            // just specifies maximum value
            if (!this[sch.kind](value, fName, undefined, sch.max)) return false;
          } else if (sch.rule) {
            // just specifies a rule (an object containing a `test()`)
            if (!this[sch.kind](value, fName, sch.rule)) return false;
          } else if (sch.set) {
            // just specifies an array of valid values
            if (!this[sch.kind](value, fName, sch.set)) return false;
          } else {
            // no qualifiers
            if (!this[sch.kind](value, fName)) return false;
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
    var pk = path.concat(key).join('.');
    if (_typeof(name) === U) return "'".concat(pk, "' of a value");
    return "".concat(name, ".").concat(pk);
  } // rufflib-validate/src/methods/array.js
  // Public method which validates an array.
  // If `validator` is specified, the array must contain a single type.


  function array(value, name) {
    this.err = null;
    if (this.skip) return true; // Deal with a value which is not an array.

    if (!Array.isArray(value)) {
      var _n = typeof name === 'string' ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
      ? name : "'".concat(name, "'") : 'a value';

      this.err = value === null ? "".concat(this.prefix, ": ").concat(_n, " is null not an array") : "".concat(this.prefix, ": ").concat(_n, " is type '").concat(_typeof(value), "' not an array");
      return false;
    } // Short-circuit if `args` is empty (only two arguments were supplied).


    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var argsLen = args.length;
    if (!argsLen) return true; // Determine the meaning of `args`.

    var min = 0;
    var max = Infinity;
    var validator = null;
    var recursiveArgs = []; // There are nine correct `args` configurations.
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

    var type0 = _typeof(args[0]);

    var arg0 = type0 === 'function' ? 'fn' : type0 === 'number' ? 'num' : args[0] == null ? 'null' // could be `undefined` or `null`
    : 'other';

    var type1 = _typeof(args[1]);

    var arg1 = type1 === 'function' ? 'fn' : type1 === 'number' ? 'num' : args[1] == null ? 'null' : 'other';

    var type2 = _typeof(args[2]);

    var arg2 = type2 === 'function' ? 'fn' : type2 === 'number' ? 'num' : args[2] == null ? 'null' : 'other';

    switch ("".concat(arg0, ",").concat(arg1, ",").concat(arg2)) {
      // 1. `args` is empty or all nullish - no min, max or validator
      case 'null,null,null':
        for (var i = 3; i < argsLen; i++) {
          if (args[i] != null) {
            this.err = "Validate.array() incorrectly invoked 1: args[".concat(i, "] not nullish!");
            throw Error(this.err);
          }
        }

        return true;
      // 2. `args[0]` is a number, and the rest of args is nullish - just min

      case 'num,null,null':
        for (var _i = 3; _i < argsLen; _i++) {
          if (args[_i] != null) {
            this.err = "Validate.array() incorrectly invoked 2: args[".concat(_i, "] not nullish!");
            throw Error(this.err);
          }
        }

        min = args[0];
        break;
      // 3. `args[0]` and `args[1]` are both numbers, rest of args nullish - min and max

      case 'num,num,null':
        for (var _i2 = 3; _i2 < argsLen; _i2++) {
          if (args[_i2] != null) {
            this.err = "Validate.array() incorrectly invoked 3: args[".concat(_i2, "] not nullish!");
            throw Error(this.err);
          }
        }

        min = args[0];
        max = args[1];
        break;
      // 4. `args[0]` is nullish, `args[1]` is number, rest of args nullish - just max

      case 'null,num,null':
        for (var _i3 = 3; _i3 < argsLen; _i3++) {
          if (args[_i3] != null) {
            this.err = "Validate.array() incorrectly invoked 4: args[".concat(_i3, "] not nullish!");
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
        } // 9. `args[0]` is number, `[1]` is function, rest anything - min and validator
        else if (arg0 === 'num' && arg1 === 'fn') {
          min = args[0];
          validator = args[1];
          recursiveArgs = args.slice(2);
        } // Any other configuration is incorrect.
        else {
          this.err = "Validate.array() incorrectly invoked 5: args is not one of the nine configurations!";
          throw Error(this.err);
        }

    } // Guard against ‘not-a-number’ bugs.


    if (Number.isNaN(min)) {
      this.err = 'Validate.array() incorrectly invoked: min is NaN!';
      throw Error(this.err);
    }

    if (Number.isNaN(max)) {
      this.err = 'Validate.array() incorrectly invoked: max is NaN!';
      throw Error(this.err);
    } // Validate the array length.


    if (value.length < min) {
      var nm = name ? "'".concat(name, "'") : 'array';
      this.err = "".concat(this.prefix, ": ").concat(nm, " length ").concat(value.length, " is < ").concat(min);
      return false;
    }

    if (value.length > max) {
      var _nm = name ? "'".concat(name, "'") : 'array';

      this.err = "".concat(this.prefix, ": ").concat(_nm, " length ").concat(value.length, " is > ").concat(max);
      return false;
    } // If `validator` is nullish, no more validation is needed.


    if (validator == null) return true; // Validate each element in the `value` array.

    var n = name ? name : '';

    for (var _i4 = 0, l = value.length; _i4 < l; _i4++) {
      // console.log(value[i], `${n}[${i}]`, validator, this.err, result);
      if (!validator.bind(this).apply(void 0, [value[_i4], "".concat(n, "[").concat(_i4, "]")].concat(_toConsumableArray(recursiveArgs)))) return false;
    }

    return true;
  } // rufflib-validate/src/methods/boolean.js
  // Public method which validates boolean `true` or `false`.


  function _boolean(value, name) {
    this.err = null;
    if (this.skip) return true;
    return this._type(value, name, 'boolean');
  } // rufflib-validate/src/methods/class.js

  /* --------------------------------- Method --------------------------------- */
  // Public method which validates a class.
  // Note the trailing underscore, because `class` is a reserved word in JavaScript.


  function class_(value, name, schema) {
    this.err = null;
    if (this.skip) return true;
    _typeof(name) === S ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
    ? name : "'".concat(name, "'") : 'a value'; // Deal with a value which is not a function.

    if (!this._type(value, name, 'function')) return false; // Short-circuit if only two arguments were supplied.

    if (_typeof(schema) === U) return true; // Check that the `schema` argument is correct.
    // @TODO optionally bypass this, when performance is important

    var isCorrect = this.schema(schema, 'schema');
    if (!isCorrect) throw Error("Validate.class() incorrectly invoked: ".concat(this.err)); // Validate `value` against the `schema`.

    if (!this._validateAgainstSchema(value, name, schema)) return false;
    return true;
  } // rufflib-validate/src/methods/integer.js
  // Public method which validates an integer like `10` or `-3.2e9`.
  // Positive and negative infinity are not integers, and neither is `NaN`.
  //
  // `minSetOrRule` is optional, and allows either a minimum integer, a set of
  // valid integers, or an object containing a `test()` function.
  // If `minSetOrRule` is an integer, undefined or null, then (optional) `max` is
  // the maximum valid integer.


  function integer(value, name, minSetOrRule, max) {
    this.err = null;
    if (this.skip) return true; // If `value` is not a valid number, then it can’t be a valid integer.

    if (!this.number(value, name, minSetOrRule, max)) return false; // Otherwise, check that `value` is an integer.

    if (0 !== value % 1) {
      var n = typeof name === 'string' ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
      ? name : "'".concat(name, "'") : 'number';
      this.err = "".concat(this.prefix, ": ").concat(n, " ").concat(value, " is not an integer");
      return false;
    }

    return true;
  } // rufflib-validate/src/methods/number.js
  // Public method which validates a number like `10` or `-3.14`.
  // Positive and negative infinity are numbers, but `NaN` is not.
  //
  // `minSetOrRule` is optional, and allows either a minimum number, a set of
  // valid numbers, or an object containing a `test()` function.
  // If `minSetOrRule` is a number, undefined or null, then (optional) `max` is
  // the maximum valid number.


  function number(value, name, minSetOrRule, max) {
    this.err = null;
    if (this.skip) return true; // Deal with the simple cases where `value` is not a valid number.

    if (!this._type(value, name, 'number')) return false;

    if (Number.isNaN(value)) {
      this.err = "".concat(this.prefix, ": '").concat(name, "' is NaN, not a valid number");
      return false;
    }

    var msorIsObj = _typeof(minSetOrRule) === 'object' && minSetOrRule != null;
    var n = typeof name === 'string' ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
    ? name : "'".concat(name, "'") : 'number'; // If `minSetOrRule` is an array, treat it as a set of valid numbers.

    if (msorIsObj && Array.isArray(minSetOrRule)) {
      if (-1 !== minSetOrRule.indexOf(value)) return true;
      var arr = "[".concat(minSetOrRule, "]");
      arr = arr.length < 21 ? arr : "".concat(arr.slice(0, 12), "...").concat(arr.slice(-5));
      this.err = "".concat(this.prefix, ": ").concat(n, " ").concat(value, " is not in ").concat(arr);
      return false;
    } // If `minSetOrRule` is a rule, run the test function.


    if (msorIsObj && typeof minSetOrRule.test === 'function') {
      if (minSetOrRule.test(value)) return true;
      var tst = "".concat(minSetOrRule.test);
      tst = tst.length < 21 ? tst : "".concat(tst.slice(0, 12), "...").concat(tst.slice(-5));
      this.err = "".concat(this.prefix, ": ").concat(n, " ").concat(value, " fails ").concat(tst);
      return false;
    } // If `minSetOrRule` is a valid number, treat it as the minimum valid number.


    if (typeof minSetOrRule === 'number') {
      var min = minSetOrRule;

      if (Number.isNaN(min)) {
        this.err = 'Validate.number() incorrectly invoked: min is NaN!';
        throw Error(this.err);
      }

      if (value < min) {
        this.err = "".concat(this.prefix, ": ").concat(n, " ").concat(value, " is < ").concat(min);
        return false;
      }
    } // Here, `minSetOrRule` can be ignored. If `max` is a valid number, treat it
    // as the minimum valid number.


    if (typeof max === 'number') {
      if (Number.isNaN(max)) {
        this.err = 'Validate.number() incorrectly invoked: max is NaN!';
        throw Error(this.err);
      }

      if (value > max) {
        this.err = "".concat(this.prefix, ": ").concat(n, " ").concat(value, " is > ").concat(max);
        return false;
      }
    } // The number is valid, yay!


    return true;
  } // rufflib-validate/src/methods/object.js

  /* --------------------------------- Method --------------------------------- */
  // Public method which validates a plain object.


  function object(value, name, schema) {
    this.err = null;
    if (this.skip) return true;
    var n = _typeof(name) === S ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
    ? name : "'".concat(name, "'") : 'a value'; // Deal with a value which is not a plain object.

    if (value === null) {
      this.err = "".concat(this.prefix, ": ").concat(n, " is null not an object");
      return false;
    }

    if (Array.isArray(value)) {
      this.err = "".concat(this.prefix, ": ").concat(n, " is an array not an object");
      return false;
    }

    if (!this._type(value, name, 'object')) return false; // Short-circuit if only two arguments were supplied.

    if (_typeof(schema) === U) return true; // Check that the `schema` argument is correct.
    // @TODO optionally bypass this, when performance is important

    var isCorrect = this.schema(schema, 'schema');
    if (!isCorrect) throw Error("Validate.object() incorrectly invoked: ".concat(this.err)); // Validate `value` against the `schema`.

    if (!this._validateAgainstSchema(value, name, schema)) return false;
    return true;
  } // rufflib-validate/src/methods/schema.js

  /* --------------------------------- Method --------------------------------- */
  // Public method which validates a schema object.
  // The optional `metaSchema` argument defines properties which `_meta` objects
  // must contain. If `metaSchema` is omitted, `_meta` can be an empty object.


  function schema(value, name, metaSchema) {
    this.err = null;
    if (this.skip) return true; // If present, check that the `metaSchema` is a plain object.

    if (_typeof(metaSchema) !== U) {
      if (metaSchema === null || _typeof(metaSchema) !== O || Array.isArray(metaSchema)) {
        var is = getIs(metaSchema);
        throw Error("Validate.schema() incorrectly invoked: ".concat(this.prefix, ": ") + "optional 'metaSchema' is ".concat(is, " not an object"));
      }
    } // Recursively check that `value` is a correct `schema`.


    var err = checkSchemaCorrectness(value, name, [], metaSchema, this);

    if (err) {
      this.err = "".concat(this.prefix, ": ").concat(err);
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
    if (sma === null || _typeof(sma) !== O || Array.isArray(sma)) {
      var is = getIs(sma);
      if (!name && path.length === 0) return "the schema is ".concat(is, " not an object");
      if (!name) return "'".concat(path.join('.'), "' of the schema is ").concat(is, " not an object");
      if (path.length === 0) return "'".concat(name, "' is ").concat(is, " not an object");
      return "'".concat(name, ".").concat(path.join('.'), "' is ").concat(is, " not an object");
    } // Check that its `_meta` value is a plain object.


    var _meta = sma._meta;

    if (_meta === null || _typeof(_meta) !== O || Array.isArray(_meta)) {
      var _is = getIs(_meta);

      if (!name && path.length === 0) return "top level '_meta' of the schema is ".concat(_is, " not an object");
      if (!name) return "'".concat(path.join('.'), "._meta' of the schema is ").concat(_is, " not an object");
      if (path.length === 0) return "'".concat(name, "._meta' is ").concat(_is, " not an object");
      return "'".concat(name, ".").concat(path.join('.'), "._meta' is ").concat(_is, " not an object");
    } // If the special `_meta.inst` value exists, chack that it is an object with
    // a `name` property.


    var inst = sma._meta.inst;

    if (typeof inst !== 'undefined') {
      if (inst === null || _typeof(inst) !== F || Array.isArray(inst)) {
        var _is2 = getIs(inst);

        if (!name && path.length === 0) return "top level '._meta.inst' of the schema is ".concat(_is2, " not type 'function'");
        if (!name) return "'".concat(path.join('.'), "._meta.inst' of the schema is ").concat(_is2, " not type 'function'");
        if (path.length === 0) return "'".concat(name, "._meta.inst' is ").concat(_is2, " not type 'function'");
        return "'".concat(name, ".").concat(path.join('.'), "._meta.inst' is ").concat(_is2, " not type 'function'");
      }

      if (typeof inst.name !== 'string') {
        var _is3 = getIs(inst.name);

        if (!name && path.length === 0) return "top level '._meta.inst.name' of the schema is ".concat(_is3, " not 'string'");
        if (!name) return "'".concat(path.join('.'), "._meta.inst.name' of the schema is ").concat(_is3, " not 'string'");
        if (path.length === 0) return "'".concat(name, "._meta.inst.name' is ").concat(_is3, " not 'string'");
        return "'".concat(name, ".").concat(path.join('.'), "._meta.inst.name' is ").concat(_is3, " not 'string'");
      }
    } // Use `metaSchema` (if provided) to validate the `_meta` object.
    // @TODO
    // Check each key/value pair.


    for (var key in sma) {
      // Every value must be a plain object.
      var value = sma[key];

      if (value === null || _typeof(value) !== O || Array.isArray(value)) {
        return fmtErr(name, path, key, "is ".concat(getIs(value), " not an object"));
      } // Validate the special `_meta` property.


      if (key === '_meta') {
        if (metaSchema) {
          var n = name && path.length ? "".concat(name, ".").concat(path.join('.'), "._meta") : name ? "".concat(name, "._meta") : path.length ? "".concat(path.join('.'), "._meta") : "top level _meta";
          if (!that.object(value, n, metaSchema)) return that.err.slice(that.prefix.length + 2);
        }

        continue;
      } // Deal with a sub-schema.


      if (value._meta) {
        var err = checkSchemaCorrectness(value, name, [].concat(_toConsumableArray(path), [key]), metaSchema, that);
        if (err) return err;
        continue;
      } // Schema value properties are never allowed to be `null`.


      if (value.fallback === null) return fmtErr(name, path, key, "is null", 'fallback');
      if (value.max === null) return fmtErr(name, path, key, "is null", 'max');
      if (value.min === null) return fmtErr(name, path, key, "is null", 'min');
      if (value.rule === null) return fmtErr(name, path, key, "is null", 'rule');
      if (value.set === null) return fmtErr(name, path, key, "is null", 'set'); // Get handy shortcuts to schema value properties, and whether they’re undefined.

      var tf = Array.isArray(value.fallback) ? A : _typeof(value.fallback);
      var tmax = Array.isArray(value.max) ? A : _typeof(value.max);
      var tmin = Array.isArray(value.min) ? A : _typeof(value.min);
      var tr = Array.isArray(value.rule) ? A : _typeof(value.rule);
      var ts = Array.isArray(value.set) ? A : _typeof(value.set);
      var tfnu = tf !== U;
      var tmaxnu = tmax !== U;
      var tminnu = tmin !== U;
      var trnu = tr !== U;
      var tsnu = ts !== U; // Only one of `max`, `min`, `rule` and `set` is allowed to exist...

      var qnum = tmaxnu + tminnu + trnu + tsnu;
      if (qnum > 1) if (qnum !== 2 || !tmaxnu || !tminnu) // ...apart from the min/max pair
        return fmtErr(name, path, key, "has '".concat(qnum, "' qualifiers, only 0 or 1 allowed")); // Deal with a value definition.

      var vk = value.kind;

      switch (vk) {
        case A:
          // array
          return '@TODO array';

        case B:
          // boolean
          if (tf !== B && tfnu) return fmtErr( // undefined fallback means value is mandatory
          name, path, key, "has '".concat(tf, "' fallback, not '").concat(B, "' or '").concat(U, "'"));
          if (tmaxnu) return fmtErr(name, path, key, "has '".concat(tmax, "' max, not '").concat(U, "'"));
          if (tminnu) return fmtErr(name, path, key, "has '".concat(tmin, "' min, not '").concat(U, "'"));
          if (trnu) return fmtErr(name, path, key, "has '".concat(tr, "' rule, not '").concat(U, "'"));
          if (tsnu) return fmtErr(name, path, key, "has '".concat(ts, "' set, not '").concat(U, "'"));
          break;

        case I: // integer

        case N:
          // number
          if (tf !== N && tfnu) return fmtErr(name, path, key, "has '".concat(tf, "' fallback, not '").concat(N, "' or '").concat(U, "'"));
          if (tmax !== N && tmaxnu) return fmtErr(name, path, key, "has '".concat(tmax, "' max, not '").concat(N, "' or '").concat(U, "'"));
          if (tmin !== N && tminnu) return fmtErr(name, path, key, "has '".concat(tmin, "' min, not '").concat(N, "' or '").concat(U, "'"));

          if (tr === O) {
            var trt = _typeof(value.rule.test);

            if (trt !== 'function') return fmtErr(name, path, key, "has '".concat(trt, "' rule.test, not 'function'"));
          } else if (trnu) return fmtErr(name, path, key, "has '".concat(tr, "' rule, not '").concat(O, "' or '").concat(U, "'"));

          if (ts === A) {
            for (var i = 0, l = value.set.length; i < l; i++) {
              var tsi = _typeof(value.set[i]);

              if (tsi !== N) return fmtErr(name, path, key, "has '".concat(tsi, "' set[").concat(i, "], not '").concat(N, "'"));
            }
          } else if (tsnu) return fmtErr(name, path, key, "has '".concat(ts, "' set, not an array or '").concat(U, "'"));

          break;

        case S:
          // string
          if (tf !== S && tfnu) return fmtErr(name, path, key, "has '".concat(tf, "' fallback, not '").concat(S, "' or '").concat(U, "'"));
          if (tmax !== N && tmaxnu) return fmtErr(name, path, key, "has '".concat(tmax, "' max, not '").concat(N, "' or '").concat(U, "'"));
          if (tmin !== N && tminnu) return fmtErr(name, path, key, "has '".concat(tmin, "' min, not '").concat(N, "' or '").concat(U, "'"));

          if (tr === O) {
            var _trt = _typeof(value.rule.test);

            if (_trt !== 'function') return fmtErr(name, path, key, "has '".concat(_trt, "' rule.test, not 'function'"));
          } else if (trnu) return fmtErr(name, path, key, "has '".concat(tr, "' rule, not '").concat(O, "' or '").concat(U, "'"));

          if (ts === A) {
            for (var _i5 = 0, _l = value.set.length; _i5 < _l; _i5++) {
              var _tsi = _typeof(value.set[_i5]);

              if (_tsi !== S) return fmtErr(name, path, key, "has '".concat(_tsi, "' set[").concat(_i5, "], not '").concat(S, "'"));
            }
          } else if (tsnu) return fmtErr(name, path, key, "has '".concat(ts, "' set, not an array or '").concat(U, "'"));

          break;

        default:
          // if (! name)
          //     return `'${pks}.kind' of the schema not recognised`;
          // return `'${name}.${pks}.kind' not recognised`;
          return fmtErr(name, path, key, 'not recognised', 'kind');
      }
    }

    return null; // signifies a correct schema
  } // Formats an error message.


  function fmtErr(name, // the original `name` argument
  path, // array containing path-segment strings
  key, // path-segment to add between `path` and `end`
  body, // the main body of the error
  pathEnd // [optional] path-segment to tack onto the end
  ) {
    return "'".concat(name ? name + '.' : '').concat(path.length === 0 ? '' : path.join('.') + '.').concat(key ? key : '').concat(pathEnd ? '.' + pathEnd : '', "'").concat(name ? '' : ' of the schema', " ").concat(body);
  } // Returns a description of the type of a value.


  function getIs(value) {
    return value === null ? 'null' : Array.isArray(value) ? 'an array' : "type '".concat(_typeof(value), "'");
  } // rufflib-validate/src/methods/string.js
  // Public method which validates a string like "Abc" or "".
  //
  // `minSetOrRule` is optional, and allows either a minimum string length, a set
  // of valid strings (for enums), or an object containing a `test()` function.
  // Note that JavaScript RegExps are objects which contain a `test()` function.
  // If `minSetOrRule` is a number, undefined or null, then (optional) `max` is
  // the maximum valid string length.


  function string(value, name, minSetOrRule, max) {
    this.err = null;
    if (this.skip) return true; // Deal with the simple cases where `value` is not a valid string.

    if (!this._type(value, name, 'string')) return false;
    var msorIsObj = _typeof(minSetOrRule) === 'object' && minSetOrRule != null;
    var n = typeof name === 'string' ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
    ? name : "'".concat(name, "'") : 'string'; // If `minSetOrRule` is an array, treat it as a set of valid strings.
    // This is a handy way of validating an enum.

    if (msorIsObj && Array.isArray(minSetOrRule)) {
      if (-1 !== minSetOrRule.indexOf(value)) return true;
      var val = "\"".concat(value, "\"");
      val = val.length < 21 ? val : "".concat(val.slice(0, 12), "...").concat(val.slice(-5));
      var arr = "[".concat(minSetOrRule, "]");
      arr = arr.length < 21 ? arr : "".concat(arr.slice(0, 12), "...").concat(arr.slice(-5));
      this.err = "".concat(this.prefix, ": ").concat(n, " ").concat(val, " is not in ").concat(arr);
      return false;
    } // If `minSetOrRule` is a rule, run the test function.


    if (msorIsObj && typeof minSetOrRule.test === 'function') {
      if (minSetOrRule.test(value)) return true;

      var _val = "\"".concat(value, "\"");

      _val = _val.length < 21 ? _val : "".concat(_val.slice(0, 12), "...").concat(_val.slice(-5));
      var tst = "".concat(minSetOrRule instanceof RegExp ? minSetOrRule : minSetOrRule.test);
      tst = tst.length < 21 ? tst : "".concat(tst.slice(0, 12), "...").concat(tst.slice(-5));
      this.err = "".concat(this.prefix, ": ").concat(n, " ").concat(_val, " fails ").concat(tst);
      return false;
    } // If `minSetOrRule` is a valid number, treat it as the minimum valid number.


    if (typeof minSetOrRule === 'number') {
      var min = minSetOrRule;

      if (Number.isNaN(min)) {
        this.err = 'Validate.string() incorrectly invoked: min is NaN!';
        throw Error(this.err);
      }

      if (value.length < min) {
        this.err = "".concat(this.prefix, ": ").concat(n, " length ").concat(value.length, " is < ").concat(min);
        return false;
      }
    } // Here, `minSetOrRule` can be ignored. If `max` is a valid number, treat it
    // as the minimum valid number.


    if (typeof max === 'number') {
      if (Number.isNaN(max)) {
        this.err = 'Validate.string() incorrectly invoked: max is NaN!';
        throw Error(this.err);
      }

      if (value.length > max) {
        this.err = "".concat(this.prefix, ": ").concat(n, " length ").concat(value.length, " is > ").concat(max);
        return false;
      }
    } // The string is valid, yay!


    return true;
  } // rufflib-validate/src/validate.js
  // Assembles the `Validate` class.

  /* --------------------------------- Import --------------------------------- */


  var NAME$1 = 'Validate';
  var VERSION$1 = '1.3.0';
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

  var Validate = /*#__PURE__*/_createClass( // make sure minification doesn’t squash the `name` property
  function Validate(prefix, skip) {
    _classCallCheck(this, Validate);

    this.err = null;
    this.prefix = prefix || '(anon)';
    this.skip = skip || false;
  });

  _defineProperty(Validate, "name", NAME$1);

  _defineProperty(Validate, "VERSION", VERSION$1);

  Validate.prototype._type = _type;
  Validate.prototype._validateAgainstSchema = _validateAgainstSchema;
  Validate.prototype.array = array;
  Validate.prototype["boolean"] = _boolean;
  Validate.prototype["class"] = class_;
  Validate.prototype.integer = integer;
  Validate.prototype.number = number;
  Validate.prototype.object = object;
  Validate.prototype.schema = schema;
  Validate.prototype.string = string; // rufflib-formulate/src/helpers/constants.js

  /* -------------------------------- Constants ------------------------------- */

  var NAME = 'Formulate';
  var VERSION = '0.0.1';
  var ID_PREFIX = 'rl_f'; // should NOT have trailing '-'

  var RX_IDENTIFIER = /^[_a-z][_0-9a-z]*$/;
  var RX_META_TITLE = /^[-_ 0-9a-z]{1,32}$/i;
  var RX_PATH = /^[_a-z][._0-9a-z]{0,254}$/; // rufflib-formulate/src/helpers/build-render-instructions.js

  /* -------------------------- Public Class Helpers -------------------------- */
  // Transforms a Formulate schema and path into a list of steps. Each step is
  // either an instruction for creating an HTML element, or the special
  // 'fieldsetUp' instruction.

  function buildRenderInstructions(schema) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ID_PREFIX;
    var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var skipValidation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    // Validate the constructor arguments, unless `skipValidation` is true.
    // Note that `v.schema()` is already recursive, so only needs running once.
    var v = new Validate('buildRenderInstructions()', skipValidation);
    if (depth === 1 && !v.schema(schema, "(schema) ".concat(path))) return {
      error: v.err
    };
    if (!v.object(schema._meta, "(schema) ".concat(path, "._meta"), {
      _meta: {},
      title: {
        kind: 'string',
        rule: RX_META_TITLE
      }
    }) || !v.string(path, 'path', RX_PATH) || !v.integer(depth, 'depth', 1, 3) // maximum three levels deep @TODO consider increasing this
    ) return {
      error: v.err
    }; // Create a list of steps. The first step is always an instruction to render
    // a <FIELDSET> element.

    var steps = [{
      depth: depth,
      height: 1,
      id: path,
      kind: 'fieldsetDown',
      title: schema._meta.title
    }];
    var fieldsetDownRef = steps[0]; // Step through each property in the schema object.

    for (var key in schema) {
      var val = schema[key];
      var initially = val.initially,
          kind = val.kind; // Ignore the `_meta` object.

      if (key === '_meta') continue; // If the value contains a 'kind' property, build an instruction for
      // rendering a field.

      if (kind) {
        var id = "".concat(path, ".").concat(key);

        var _v = new Validate('buildRenderInstructions()', skipValidation);

        if (!_v.string(key, 'key', RX_IDENTIFIER) // must not contain a dot
        || !_v[kind](initially, "".concat(id, ".initially")) || !_v.string(id, 'id', RX_PATH) // must be be too long
        ) return {
          error: _v.err
        };
        steps.push({
          id: id,
          initially: initially,
          kind: kind
        });
        fieldsetDownRef.height++;
        continue;
      } // The value does not contain a 'kind' property, so build an instruction
      // for rendering a sub-fieldset.


      var result = buildRenderInstructions(val, // `val` should be a sub-schema
      "".concat(path, ".").concat(key), // the path is dot-delimited
      depth + 1, // recurse down a level
      skipValidation // some of the validation needs doing on each recurse
      );
      if (result.error) return result;
      var subSteps = result.steps;
      fieldsetDownRef.height += subSteps[0].height;
      steps.push.apply(steps, _toConsumableArray(subSteps)); // spread syntax, keeps the array 1 dimensional
    } // The last step is an instruction that the <FIELDSET> element at `steps[0]`
    // has ended. Everything between the first and last instruction should be
    // nested inside that <FIELDSET> element.


    steps.push({
      kind: 'fieldsetUp'
    });
    return {
      steps: steps
    };
  }
  /* ---------------------------------- Tests --------------------------------- */
  // Tests buildRenderInstructions().


  function testBuildRenderInstructions(expect) {
    var et = expect.that;
    expect.section('buildRenderInstructions()');
    var funct = buildRenderInstructions;
    var nm = 'buildRenderInstructions'; // Is a function, with skippable validation.

    et("typeof ".concat(nm), _typeof(funct)).is('function');
    et("".concat(nm, "({_meta:{title:'Abc'}}, 'xyz', 0, true)"), funct({
      _meta: {
        title: 'Abc'
      }
    }, 'xyz', 0, true)).stringifiesTo({
      error: undefined,
      steps: [{
        depth: 0,
        height: 1,
        id: 'xyz',
        kind: 'fieldsetDown',
        title: 'Abc'
      }, {
        kind: 'fieldsetUp'
      }]
    }); // Typical invalid arguments.

    et("".concat(nm, "()"), funct()).hasError("".concat(nm, "(): '(schema) rl_f' is type 'undefined' not an object"));
    et("".concat(nm, "({})"), funct({})).hasError("".concat(nm, "(): '(schema) rl_f._meta' is type 'undefined' not an object"));
    et("".concat(nm, "({_meta:{}})"), funct({
      _meta: {}
    })).hasError("".concat(nm, "(): '(schema) rl_f._meta.title' is type 'undefined' not 'string'"));
    et("".concat(nm, "({_meta:{title:'Ok'},foo:{_meta:{title:[]}}})"), funct({
      _meta: {
        title: 'Ok'
      },
      foo: {
        _meta: {
          title: []
        }
      }
    })).hasError("".concat(nm, "(): '(schema) rl_f.foo._meta.title' is an array not type 'string'"));
    et("".concat(nm, "({_meta:{title:'Abc'}}, 123)"), funct({
      _meta: {
        title: 'Abc'
      }
    }, 123)).hasError("".concat(nm, "(): 'path' is type 'number' not 'string'"));
    et("".concat(nm, "({_meta:{title:'Abc'}}, 'xy-z')"), funct({
      _meta: {
        title: 'Abc'
      }
    }, 'xy-z')).hasError("".concat(nm, "(): 'path' \"xy-z\" fails /^[_a-z][._0...54}$/"));
    et("".concat(nm, "({_meta:{title:'Abc'}}, 'xyz', 1.5)"), funct({
      _meta: {
        title: 'Abc'
      }
    }, 'xyz', 1.5)).hasError("".concat(nm, "(): 'depth' 1.5 is not an integer"));
    et("".concat(nm, "({_meta:{title:'Abc'}}, 'xyz', 0)"), funct({
      _meta: {
        title: 'Abc'
      }
    }, 'xyz', 0)).hasError("".concat(nm, "(): 'depth' 0 is < 1")); // Path too long, depth too deep.

    et("".concat(nm, "({_meta:{title:'Abc'}}, 'a'.repeat(256))"), funct({
      _meta: {
        title: 'Abc'
      }
    }, 'a'.repeat(256))).hasError("".concat(nm, "(): 'path' \"aaaaaaaaaaa...aaaa\" fails /^[_a-z][._0...54}$/"));
    et("".concat(nm, "({_meta:{title:'Abc'},zzzzz:{initially:true,kind:'boolean'}}, 'a'.repeat(250))"), funct({
      _meta: {
        title: 'Abc'
      },
      zzzzz: {
        initially: true,
        kind: 'boolean'
      }
    }, 'a'.repeat(250))).hasError("".concat(nm, "(): 'id' \"aaaaaaaaaaa...zzzz\" fails /^[_a-z][._0...54}$/"));
    et("".concat(nm, "({_meta:{title:'A'},b:{_meta:{title:'B'},c:{_meta:{title:'C'},d:{_meta:{title:'D'}}}}}, 'a')"), funct({
      _meta: {
        title: 'A'
      },
      b: {
        _meta: {
          title: 'B'
        },
        c: {
          _meta: {
            title: 'C'
          },
          d: {
            _meta: {
              title: 'D'
            }
          }
        }
      }
    }, 'a')).hasError("".concat(nm, "(): 'depth' 4 is > 3")); // Invalid schema.

    et("".concat(nm, "({_meta:{title:'A'},foo:[]}, 'bar')"), funct({
      _meta: {
        title: 'A'
      },
      foo: []
    }, 'bar')).hasError("".concat(nm, "(): '(schema) bar.foo' is an array not an object"));
    et("".concat(nm, "({_meta:{title:'A'},caf\xE9:{kind:'boolean'}})"), funct({
      _meta: {
        title: 'A'
      },
      café: {
        kind: 'boolean'
      }
    })).hasError("".concat(nm, "(): 'key' \"caf\xE9\" fails /^[_a-z][_0-9a-z]*$/"));
    et("".concat(nm, "({_meta:{title:'A'},foo:{kind:'no such kind'}})"), funct({
      _meta: {
        title: 'A'
      },
      foo: {
        kind: 'no such kind'
      }
    })).hasError("".concat(nm, "(): '(schema) rl_f.foo.kind' not recognised"));
    et("".concat(nm, "({sub:{_meta:{title:''},_:{kind:'boolean'}},_meta:{title:'Abc'}})"), funct({
      sub: {
        _meta: {
          title: ''
        },
        _: {
          kind: 'boolean'
        }
      },
      _meta: {
        title: 'Abc'
      }
    })).hasError("".concat(nm, "(): '(schema) rl_f.sub._meta.title' \"\" fails /^[-_ 0-9a-z...2}$/i")); // Basic usage.

    et("".concat(nm, "({_meta:{title:'Abc'}}, 'a'.repeat(255), 1)"), funct({
      _meta: {
        title: 'Abc'
      }
    }, 'a'.repeat(255), 1)).stringifiesTo({
      error: undefined,
      steps: [{
        depth: 1,
        height: 1,
        id: 'a'.repeat(255),
        kind: 'fieldsetDown',
        title: 'Abc'
      }, {
        kind: 'fieldsetUp'
      }]
    });
    et("".concat(nm, "({a:{initially:false,kind:'boolean'},_meta:{title:'Abc'}})"), funct({
      a: {
        initially: false,
        kind: 'boolean'
      },
      _meta: {
        title: 'Abc'
      }
    })).stringifiesTo({
      steps: [{
        depth: 1,
        height: 2,
        id: ID_PREFIX,
        kind: 'fieldsetDown',
        title: 'Abc'
      }, {
        id: ID_PREFIX + '.a',
        initially: false,
        kind: 'boolean'
      }, {
        kind: 'fieldsetUp'
      }]
    });
    var bool = {
      initially: true,
      kind: 'boolean'
    };
    et("".concat(nm, "({sub:{_meta:{title:'Sub'},_:bool},outer:bool,_meta:{title:'Abc'}}, 'id')"), funct({
      sub: {
        _meta: {
          title: 'Sub'
        },
        _: bool
      },
      outer: bool,
      _meta: {
        title: 'Abc'
      }
    }, 'id')).stringifiesTo({
      steps: [{
        depth: 1,
        height: 4,
        id: 'id',
        kind: 'fieldsetDown',
        title: 'Abc'
      }, {
        depth: 2,
        height: 2,
        id: 'id.sub',
        kind: 'fieldsetDown',
        title: 'Sub'
      }, {
        id: 'id.sub._',
        initially: true,
        kind: 'boolean'
      }, {
        kind: 'fieldsetUp'
      }, {
        id: 'id.outer',
        initially: true,
        kind: 'boolean'
      }, {
        kind: 'fieldsetUp'
      }]
    });
  } // rufflib-formulate/src/demo-1.js

  /* ---------------------------------- Main ---------------------------------- */
  // Runs ‘Demo 1’.


  function formulateDemo1(Formulate, $el) {
    // Validate the arguments.
    var v = new Validate('formulateDemo1()');
    if (!v["class"](Formulate, 'Formulate', {
      _meta: {},
      name: {
        kind: 'string',
        rule: /^Formulate$/
      },
      VERSION: {
        kind: 'string',
        rule: /^0\.0\.1$/
      }
    }) || !v.object($el, '$el', {
      _meta: {},
      $log: {
        _meta: {
          inst: HTMLElement
        }
      },
      $form0: {
        _meta: {
          inst: HTMLElement
        }
      },
      $form1: {
        _meta: {
          inst: HTMLElement
        }
      }
    })) return {
      error: v.err
    };
    var $log = $el.$log,
        $form0 = $el.$form0,
        $form1 = $el.$form1; // Generate the top form.

    var schema0 = {
      _meta: {
        title: 'Top Form'
      },
      outer: {
        _meta: {
          title: 'Outer'
        },
        a_boolean: Formulate["boolean"](false),
        another_boolean: Formulate["boolean"](true)
      },
      foo: Formulate["boolean"](true)
    };
    var f0 = new Formulate($form0, 'schema0', schema0);
    if (f0.error) throw Error(f0.error);
    $log.innerHTML = "new Formulate($form0, 'schema0', schema0) =>\n\n";
    $log.innerHTML += JSON.stringify(f0.toObject(), null, 2); // Generate the second form.

    var schema1 = {
      _meta: {
        title: 'Second Form'
      },
      outer: {
        _meta: {
          title: 'Outer'
        },
        foo: Formulate["boolean"](false),
        inner: {
          _meta: {
            title: 'Inner'
          },
          bar: Formulate["boolean"](false),
          baz: Formulate["boolean"](true)
        },
        zub: Formulate["boolean"](false)
      }
    };
    var f1 = new Formulate($form1, 'schema1', schema1);
    if (f1.error) throw Error(f1.error);
  }
  /* ---------------------------------- Tests --------------------------------- */
  // Runs tests on ‘Demo 1’.


  function testDemo1(expect, Formulate) {
    var _class, _class2, _class3;

    expect.section('Demo 1');
    var et = expect.that; // Basics.

    et("typeof formulateDemo1", _typeof(formulateDemo1)).is('function'); // Invalid arguments.

    et("formulateDemo1()", formulateDemo1()).hasError("formulateDemo1(): 'Formulate' is type 'undefined' not 'function'");
    et("formulateDemo1(function () {})", formulateDemo1(function () {})).hasError("formulateDemo1(): 'Formulate.name' \"\" fails /^Formulate$/");
    et("formulateDemo1(class Nope {})", formulateDemo1( /*#__PURE__*/_createClass(function Nope() {
      _classCallCheck(this, Nope);
    }))).hasError("formulateDemo1(): 'Formulate.name' \"Nope\" fails /^Formulate$/");
    et("formulateDemo1(class Formulate {})", formulateDemo1( /*#__PURE__*/_createClass(function Formulate() {
      _classCallCheck(this, Formulate);
    }))).hasError("formulateDemo1(): 'Formulate.VERSION' is type 'undefined' not 'string'");
    et("formulateDemo1(class Formulate { static VERSION = 'Also Nope' })", formulateDemo1((_class = /*#__PURE__*/_createClass(function Formulate() {
      _classCallCheck(this, Formulate);
    }), _defineProperty(_class, "VERSION", 'Also Nope'), _class))).hasError("formulateDemo1(): 'Formulate.VERSION' \"Also Nope\" fails /^0\\.0\\.1$/");
    et("formulateDemo1(class Formulate { static VERSION = '0.0.1' })", formulateDemo1((_class2 = /*#__PURE__*/_createClass(function Formulate() {
      _classCallCheck(this, Formulate);
    }), _defineProperty(_class2, "VERSION", '0.0.1'), _class2))).hasError("formulateDemo1(): '$el' is type 'undefined' not 'object'");
    et("formulateDemo1(class Formulate { static VERSION = '0.0.1' }, {})", formulateDemo1((_class3 = /*#__PURE__*/_createClass(function Formulate() {
      _classCallCheck(this, Formulate);
    }), _defineProperty(_class3, "VERSION", '0.0.1'), _class3), {})).hasError("formulateDemo1(): '$el.$log' is type 'undefined' not an object");
    var $mock = document.createElement('div');
    et("formulateDemo1(Formulate, { $log:$mock, $form0:{}, $form1:1 })", formulateDemo1(Formulate, {
      $log: $mock,
      $form0: {},
      $form1: 1
    })).hasError("formulateDemo1(): '$el.$form0' is not an instance of 'HTMLElement'");
    et("formulateDemo1(Formulate, { $log:$mock, $form0:$mock, $form1:null })", formulateDemo1(Formulate, {
      $log: $mock,
      $form0: $mock,
      $form1: null
    })).hasError("formulateDemo1(): '$el.$form1' is null not an object"); // Working ok.

    et("formulateDemo1(Formulate, { $log:$mock, $form0:$mock, $form1:$mock })", formulateDemo1(Formulate, {
      $log: $mock,
      $form0: $mock,
      $form1: $mock
    })).is(undefined);
  } // rufflib-formulate/src/formulate.js

  /* ---------------------------------- Tests --------------------------------- */
  // Runs basic tests on Formulate.


  function testFormulateBasics(expect, Formulate) {
    var et = expect.that;
    expect.section('Formulate basics');
    var $el = document.createElement('div'); // Is a class.

    et("typeof Formulate // in JavaScript, a class is type 'function'", _typeof(Formulate)).is('function');
    et("Formulate.name // minification should not squash '".concat(NAME, "'"), Formulate.name).is(NAME);
    et("Formulate.VERSION // make sure we are testing ".concat(VERSION), Formulate.VERSION).is(VERSION);
    et("typeof new Formulate() // invalid invocation, but still an object", _typeof(new Formulate())).is('object'); // Invalid constructor arguments.

    et("new Formulate()", new Formulate()).hasError("new Formulate(): '$container' is type 'undefined' not 'object'");
    et("new Formulate({})", new Formulate({})).hasError("new Formulate(): '$container' is not an instance of 'HTMLElement'");
    et("new Formulate($el)", new Formulate($el)).hasError("new Formulate(): 'identifier' is type 'undefined' not 'string'");
    et("new Formulate($el, '1abc')", new Formulate($el, '1abc')).hasError("new Formulate(): 'identifier' \"1abc\" fails /^[_a-z][_0-9a-z]*$/");
    et("new Formulate($el, 'abc')", new Formulate($el, 'abc')).hasError("new Formulate(): 'schema' is type 'undefined' not an object");
    et("new Formulate($el, 'abc', {_meta:{title:'Ok'},a:{kind:'number'},b:{kind:'nope!'}})", new Formulate($el, 'abc', {
      _meta: {
        title: 'Ok'
      },
      a: {
        kind: 'number'
      },
      b: {
        kind: 'nope!'
      }
    })).hasError("new Formulate(): 'schema.b.kind' not recognised");
    et("new Formulate($el, 'abc', {_meta:{}})", new Formulate($el, 'abc', {
      _meta: {}
    })).hasError("new Formulate(): 'schema._meta.title' is type 'undefined' not 'string'");
    et("new Formulate($el, 'abc', {_meta:{title:''}})", new Formulate($el, 'abc', {
      _meta: {
        title: ''
      }
    })).hasError("new Formulate(): 'schema._meta.title' \"\" fails /^[-_ 0-9a-z...2}$/i");
    var missingTitleSchema = {
      _meta: {
        title: 'The Top-Level Title Exists'
      },
      oops: {
        _meta: {}
      } // no `title` in here!

    };
    et("new Formulate($el, 'my_form', missingTitleSchema)", new Formulate($el, 'my_form', missingTitleSchema)).hasError("new Formulate(): 'schema.oops._meta.title' is type 'undefined' not 'string'"); // constructor arguments ok.

    et("new Formulate($el, 'abc', {_meta:{title:'Abc'}})", new Formulate($el, 'abc', {
      _meta: {
        title: 'Abc'
      }
    })).has({
      $container: $el,
      identifier: 'abc',
      schema: {
        _meta: {
          title: 'Abc'
        }
      }
    });
    var typicalUsageSchema = {
      _meta: {
        title: 'My Form'
      },
      outer: {
        _meta: {
          title: 'Outer'
        },
        an_inner_boolean: Formulate["boolean"](false),
        another_boolean: Formulate["boolean"](true)
      },
      outer_boolean: Formulate["boolean"](true)
    };
    et("new Formulate($el, 'my_form', typicalUsageSchema)", new Formulate($el, 'my_form', typicalUsageSchema)).has({
      $container: $el,
      identifier: 'my_form',
      schema: typicalUsageSchema
    });
  } // rufflib-formulate/src/entry-point-for-tests.js
  // Run each test. You can comment-out some during development, to help focus on
  // individual tests. But make sure all tests are uncommented before committing.


  function formulateTest(expect, Formulate) {
    // Mock a DOM, for NodeJS.
    if ((typeof global === "undefined" ? "undefined" : _typeof(global)) === 'object') {
      global.HTMLElement = /*#__PURE__*/function () {
        function HTMLElement() {
          _classCallCheck(this, HTMLElement);
        }

        _createClass(HTMLElement, [{
          key: "addEventListener",
          value: function addEventListener() {}
        }, {
          key: "appendChild",
          value: function appendChild() {}
        }, {
          key: "createElement",
          value: function createElement() {
            return new HTMLElement();
          }
        }]);

        return HTMLElement;
      }();

      HTMLElement.prototype.classList = {
        add: function add() {}
      };
      HTMLElement.prototype.style = {};
      global.document = new HTMLElement();
    }

    testFormulateBasics(expect, Formulate);
    testBuildRenderInstructions(expect);
    testDemo1(expect, Formulate);
  }

  return formulateTest;

}));
