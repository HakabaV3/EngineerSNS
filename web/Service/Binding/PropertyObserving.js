var Observing = require('./Observing.js'),
    CustomObserver = require('../Observer/CustomObserver.js');

/**
 *  PropertyObserving
 *
 *  This class presents an observing state for object's property.
 *
 *  @constructor
 *  @param {Object} target target object.
 *  @param {string} key target property path like 'deep.property.name'
 *  @extends {Observing}
 */
function PropertyObserving(target, key) {
    Observing.apply(this, arguments);
}
inherits(PropertyObserving, Observing);

PropertyObserving.prototype.finalize = function() {
    CustomObserver.unobserve(target, key, this.onChange, this);

    Observing.prototype.finalize.apply(this, arguments);
};

PropertyObserving.prototype.setup = function() {
    var target = this.target,
        key = this.key;

    CustomObserver.observe(target, key, this.onChange, this);
};

PropertyObserving.prototype.getValue = function(newValue) {
    var deep = getObjectForPath(this.target, this.key);

    return deep ? deep.object[deep.key] : null;
};

PropertyObserving.prototype.setValue = function(newValue) {
    var deep = getObjectForPath(this.target, this.key),
        oldValue,
        object,
        key;

    if (!isObject(deep)) return;

    object = deep.object;
    key = deep.key;
    listenerName = 'on' + key.charAt(0).toUpperCase() + key.substr(1);
    oldValue = object[key];

    object[key] = newValue;

    if (isFunction(object[listenerName])) {
        object[listenerName](oldValue, newValue);
    }
};

/**
 *  オブジェクトのプロパティをたどって、最下層のオブジェクトを返す
 *
 *  @example
 *      path='foo.bar.buz.piyo'の場合、
 *      {
 *          object: object.foo.bar.buz,
 *          key: 'piyo'
 *      }
 *      を返す。
 *
 *  @param {Object} object object
 *  @param {string} path path
 *  @return {{
 *      object: Object,
 *      key: string
 *  }} result object.
 */
function getObjectForPath(object, path) {
    var parts = path.split('.'),
        part;

    if (!isObject(object)) return null;

    while (parts.length > 1) {
        part = parts.shift();
        object = object[part];
        if (!isObject(object)) return null;
    }

    return {
        object: object,
        key: parts[0]
    };
}

PropertyObserving.prototype.onChange = function(changes) {
    forEach(changes, function(change) {
        var newVal = change.newValue,
            oldVal = change.oldValue;

        this.fire('change', this, oldVal, newVal);
    }, this);
};

module.exports = PropertyObserving;
