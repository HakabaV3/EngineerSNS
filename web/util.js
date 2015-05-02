/**
 * extended from Array.slice
 * @type {Function<Array, number>:Array}
 */
global.slice = Array.prototype.slice.call.bind(Array.prototype.slice);

/**
 * extended from Array.forEach
 * @type {Function<Array, Function, Object|null>}
 */
global.forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

/**
 * If an expression is string, return true, otherwise false.
 * @param {*} exp expression
 * @return {boolean} If true, the expression is a string.
 */
global.isString = function(exp) {
    return typeof exp === 'string';
};

/**
 * If an expression is object, return true, otherwise false.
 * When expression is undefined, 'typeof undeifned' returns 'object',
 * but this method return false.
 *
 * @param {*} exp expression
 * @return {boolean} If true, the expression is a object.
 */
global.isObject = function(exp) {
    return exp && typeof exp === 'object';
};

/**
 * If an expression is function, return true, otherwise false.
 * @param {*} exp expression
 * @return {boolean} If true, the expression is a function.
 */
global.isFunction = function(exp) {
    return typeof exp === 'function';
};

/**
 * no-operation
 */
global.noop = function() {};

/**
 * inherit class
 * @param {Function} child child class
 * @param {Function} parent parent class.
 */
global.inherits = function(child, parent) {
    /**
     * dummy constructor
     *	@constructor
     */
    var __ = function() {};
    __.prototype = parent.prototype;
    child.prototype = new __();
    child.prototype.constructor = child;
};

/**
 * extend object
 * @param {Object} target target will be extended.
 * @param {...Object} [sources] source object.
 * @return {Object} extended target.
 */
global.extend = function(target, sources) {
    slice(arguments, 1)
        .forEach(function(source) {
            if (!isObject(source)) return target;
            Object.keys(source).forEach(function(key) {
                target[key] = source[key];
            });
        });

    return target;
};
