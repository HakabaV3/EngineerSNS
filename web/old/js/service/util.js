var util = {};

util.inherits = function(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
    child.prototype.super = parent.prototype;
    util.extend(child, parent);
};

util.mixin = function(target, src) {
    util.extend(target.prototype, src.prototype, {
        construcotr: target.prototype.constructor,
        super: target.prototype.super,
    });
    util.extend(child, parent);
};

util.extend = function(target, srces) {
    util.slice(arguments, 1)
        .forEach(function(src) {
            Object.keys(src).forEach(function(keyName) {
                target[keyName] = src[keyName];
            });
        });

    return target;
};

util.isObject = function(exp) {
    return !!exp && typeof exp === 'object';
};

util.isString = function(exp) {
    return typeof exp === 'string';
};

util.isFunction = function(exp) {
    return typeof exp === 'function';
};

util.runAsync = function(fn) {
    return util.isFunction(window.requestAnimationFrame) ?
        requestAnimationFrame(fn) :
        setTimeout(fn);
};

util.once = function(node, type, callback) {
    var proxy = function() {
        node.removeEventListener(type, proxy);

        if (util.isFunction(callback)) {
            callback.apply(this, arguments);
        } else if (util.isFunction(callback.handleEvent)) {
            callback.handleEvent.apply(callback, arguments);
        }
    };

    node.addEventListener(type, proxy);
};

var ap = Array.prototype

util.forEach = ap.forEach.call.bind(ap.forEach);
util.map = ap.forEach.call.bind(ap.map);
util.slice = ap.forEach.call.bind(ap.slice);

module.exports = util;
