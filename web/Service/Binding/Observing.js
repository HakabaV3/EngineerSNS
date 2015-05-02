var EventDispatcher = require('../EventDispatcher.js');

/**
 *  Observing
 *
 *  This class presents an obsrving state for many situations like below.
 *  - Object property.
 *  - Node attribute.
 *
 *  This is abstract class, so please use extended class like below.
 *  - PropertyObserving <--- for object property.
 *  - AttributeObserving <--- for node attribute.
 *
 *  @constructor
 *  @param {Object} target target object.
 *  @param {string} key target key
 *  @extends {EventDispatcher}
 */
function Observing(target, key) {
    EventDispatcher.apply(this, arguments);

    if (!isObject(target)) {
        throw new Error('Observing target must be object.');
    }

    if (!isString(key) || key === '') {
        throw new Error('\'' + key + '\' is invalid for Observing key.');
    }

    /**
     *  @type {Object}
     */
    this.target = target;

    /**
     *  @type {string}
     */
    this.key = key;

    this.setup();
}
inherits(Observing, EventDispatcher);

Observing.prototype.finalize = function() {
    EventDispatcher.prototype.finalize.apply(this, arguments);
};

Observing.prototype.setup = function() {
    throw new Error('Observing#setup must be overrided.');
};

Observing.prototype.setValue = function(newValue) {
    throw new Error('Observing#setValue must be overrided.');
};

module.exports = Observing;
