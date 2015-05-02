var Observing = require('./Observing.js'),
    Map = require('../Map.js');

/**
 *  AttributeObserving
 *
 *  This class presents an observing state for node's attribute.
 *
 *  @constructor
 *  @param {Element} target target element.
 *  @param {string} key target attribute name.
 *  @extends {Observing}
 */
function AttributeObserving(target, key) {
    Observing.apply(this, arguments);
}
inherits(AttributeObserving, Observing);

/**
 *  callback for MutationObserver.
 *  @param {Array<Object>} mutations mutations
 */
AttributeObserving.onChange = function(mutations) {
    forEach(mutations, function(mutation) {
        var listeners = this.listenersMap_.get(mutation.target);
        forEach(listeners, function(listener) {
            if (listener.key !== mutation.attributeName) return;

            listener.fire('change', listener, mutation.oldValue, listener.getValue());
        });
    }, AttributeObserving);
};

/**
 *  @type {MutationObserver}
 */
AttributeObserving.centralObserver_ = new MutationObserver(AttributeObserving.onChange);

/**
 *  @type {Map}
 */
AttributeObserving.listenersMap_ = new Map();

AttributeObserving.prototype.finalize = function() {
    //@TODO

    Observing.prototype.finalize.apply(this, arguments);
};

AttributeObserving.prototype.setup = function() {
    var target = this.target,
        key = this.key,
        listeners = AttributeObserving.listenersMap_.get(target);

    if (!listeners) {
        listeners = [];
        AttributeObserving.listenersMap_.set(target, listeners);

        AttributeObserving.centralObserver_.observe(target, {
            childList: false,
            attributes: true,
            characterData: false,
            subtree: false,
            attributeOldValue: true,
            characterDataOldValue: false
        });

        //@TODO
        // tune up with attributeFilter option.
    }

    listeners.push(this);
};

AttributeObserving.prototype.getValue = function() {
    var value = this.target.getAttribute(this.key);

    return value || '';
};

AttributeObserving.prototype.setValue = function(newValue) {
    var key, listeners;

    if (isObject(newValue)) {
        key = this.key;
        listeners = AttributeObserving.listenersMap_.get(this.target);
        forEach(listeners, function(listener) {
            if (listener === this ||
                listener.key !== key) return;
            listener.fire('change', listener, listener.getValue(), newValue);
        }, this);
    } else {
        if (!newValue && newValue !== 0) {
            this.target.removeAttribute(this.key);
        } else {
            this.target.setAttribute(this.key, newValue);
        }
    }
};

module.exports = AttributeObserving;
