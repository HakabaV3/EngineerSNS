var global = this;

/**
 *  extend class.
 *  @param {Function} child child class.
 *  @param {Function} parent super class.
 */
function extendClass(child, parent) {
    /**
     *  copy static members.
     */
    extend(child, parent);

    /**
     *  dummy constructor
     *  @constructor
     */
    var __ = function() {};
    __.prototype = new parent();
    child.prototype = new __();

    /**
     *  set inheritance information.
     */
    parent.prototype.constructor = parent;
    child.prototype.constructor = child;
}

/**
 *  generate GUID
 *  @return {number} GUID
 */
var GUID = (function() {
    var GUID_ = 0;
    return function() {
        return ++GUID_;
    };
})();

/**
 *  extend object property.
 *  @param {Object} target target object.
 *  @param {...Object} optSrces source objects.
 *  @return {Object} extended target.
 */
function extend(target, optSrces) {
    Array.prototype.slice.call(arguments, 1)
        .forEach(function(src) {
            if (!src) return;
            Object.keys(src).forEach(function(key) {
                target[key] = src[key];
            });
        });

    return target;
}

/**
 *  convert object to array.
 *  @param {{
 *    length: String
 *  }} arrayLike arrayLike object.
 *  @return {Array} converted array.
 */
function convertToArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike, 0);
}

/**
 *  check if expression is object.
 *  @param {*} expression expression to check.
 *  @return {boolean} if true, the expression is Object.
 */
function isObject(expression) {
    return !!expression && typeof expression === 'object';
}

/**
 *  check if expression is function.
 *  @param {*} expression expression to check.
 *  @return {boolean} if true, the expression is Function.
 */
function isFunction(expression) {
    return typeof expression === 'function';
}

/**
 *  short-hand
 */
var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

/**
 *  no operation function
 */
function noop() {
    return undefined;
}

/**
 *  escape for XSS
 *  @param {string} src source text
 *  @return {string} escaped text
 */
function escapeForXSS(src) {
    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
