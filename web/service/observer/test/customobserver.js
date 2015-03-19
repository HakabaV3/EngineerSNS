(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Map = window.Map;

if (typeof Map !== 'function') {
    Map = function Map() {
        /**
         * It's 0, constant.
         * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map
         * @type {number}
         */
        this.length = 0;

        /**
         * keys
         * @type {Number}
         * @private
         */
        this.keys_ = [];

        /**
         * number
         * @type {Number}
         * @private
         */
        this.values_ = [];
    }

    /**
     *  Returns the number of key/value pairs in the Map object.
     *  @type {number}
     */
    Map.prototype.__defineGetter__('size', function() {
        return this.keys_.length;
    });

    /**
     *  Removes all key/value pairs from the Map object.
     */
    Map.prototype.clear = function() {
        this.keys_ = [];
        this.values_ = [];
    };

    /**
     * Removes any value associated to the key and
     * returns the value that Map.prototype.has(value) would have previously returned.
     * Map.prototype.has(key) will return false afterwards.
     *
     * @param {string} key key
     * @return {boolean} if true, map has contianed the key.
     */
    Map.prototype.delete = function(key) {
        if (!this.has(key)) {
            return false;
        }

        var index = this.keys_.indexOf(key);
        this.keys_.splice(index, 1);
        this.values_.splice(index, 1);

        return true;
    };

    Map.prototype.entries = function() {
        throw new Error('Map.prototype.entries: NIY.');
    };

    /**
     * Executes a provided function once per each key/value pair
     * in the Map object, in insertion order.
     *
     * @param {Function} callback callback,
     * @param {*} [thisArg] callback context.
     *                      If it's not provided, the context is global object (maybe, it is window).
     *                      (In original definition, the context is undefined.);
     */
    Map.prototype.forEach = function(callback, thisArg) {
        this.values_.forEach(callback, thisArg);
    }

    /**
     * Returns a specified element from a Map object.
     * @param {string} key the key.
     * @return If the specified key is exists, the value is returned, otherwise undefined.
     */
    Map.prototype.get = function(key) {
        var index = this.keys_.indexOf(key);

        return index === -1 ? undefined : this.values_[index];
    };

    /**
     * Returns a boolean indicating whether an element with the specified key exists or not.
     * @param {string} key the key.
     * @return {boolean} true if an element with the specified key exists in the Map object, otherwise false.
     */
    Map.prototype.has = function(key) {
        return this.keys_.indexOf(key) !== -1;
    };

    Map.prototype.keys = function(key) {
        throw new Error('Map.prototype.keys: NIY.');
    };

    /**
     * Adds a new element with a specified key and value to a Map object.
     * @param {*} key the key.
     * @param {*} value the value.
     * @return {Map} this map object.
     */
    Map.prototype.set = function(key, value) {
        var index = this.keys_.indexOf(key);

        if (index === -1) {
            this.keys_.push(key);
            this.values_.push(value);
        } else {
            this.values_[index] = value;
        }

        return this;
    };
}

module.exports = Map;

},{}],2:[function(require,module,exports){
var util = require('../util.js'),
    Map = require('../map.js'),
    ObjectObserver = require('./objectobserver.js');

/**
 *  @constructor
 *  @param {Object} target
 *  @param {string} propName
 */
function CustomObserver(target, propName) {
    this.onChangeHandler_ = this.onChangeHandler_.bind(this);

    /**
     *  target
     *  @type {Object}
     *  @private
     */
    this.targets_ = [target];

    /**
     *  @type {string}
     *  @private
     */
    this.propName_ = propName;

    /**
     *  @type {[string]}
     *  @private
     */
    this.propNameTokens_ = propName.split('.');

    /**
     *  callbacks
     *  @type {[Function]}
     *  @private
     */
    this.callbacks_ = [];

    /**
     * @type {*}
     * @private
     */
    this.oldValue_ = null;

    this.resetObserve_(0);
    this.oldValue_ = this.getValue();
}

/**
 * instance map
 */
CustomObserver.instances_ = new Map();


/**
 * returns instance
 * @param  {Object}   object   object
 * @param  {string}   propName string
 * @return {CustomObserver} if exists, instance, otherwise null.
 * @private
 */
CustomObserver.getInstance_ = function(object, propName) {
    var subMap = this.instances_.get(object);

    if (!subMap) return;

    return subMap.get(propName) || null;
};

/**
 * add instance
 * @param  {Object}   object   object
 * @param  {string}   propName string
 * @return {CustomObserver} instance.
 * @private
 */
CustomObserver.addInstance_ = function(object, propName) {
    var subMap = this.instances_.get(object),
        instance = new CustomObserver(object, propName);

    if (!subMap) {
        subMap = new Map();
        this.instances_.set(object, subMap);
    }

    subMap.set(propName, instance);

    return instance;
};

/**
 * remove instance
 * @param {CustomObserver} instance instance
 * @private
 */
CustomObserver.removeInstance_ = function(instance) {
    var object = isntance.targets_[0],
        instances_ = this.instances_,
        subMap = instances_.get(instance.targets_[0]);

    instance.targets_[0] = null;
    instance.resetObserve_(0);
    instance.onChangeHandler_ = null;

    if (!subMap) return;

    subMap.delete(instance.propName_);

    if (subMap.size !== 0) return;

    instances_.delete(object);
};

/**
 * observe
 * @param  {Object}   object   object
 * @param  {string}   propName string
 * @param  {Function} callback callback
 */
CustomObserver.observe = function(object, propName, callback) {
    var instance = this.getInstance_(object, propName);

    if (!instance) {
        instance = this.addInstance_(object, propName);
    }

    instance.addCallback_(callback);
};

/**
 * unobserve
 * @param  {Object}   object   object
 * @param  {string}   propName string
 * @param  {Function} callback callback
 */
CustomObserver.unobserve = function(object, propName, callback) {
    var instance = this.getInstance(object, propName);

    if (!instance) return;

    instance.removeCallback_(callback);
};

CustomObserver.prototype.addCallback_ = function(callback) {
    var callbacks = this.callbacks_,
        index = callbacks.indexOf(callback);

    if (index !== -1) return;

    callbacks.push(callback);
};

CustomObserver.prototype.removeCallback_ = function(callback) {
    var callbacks = this.callbacks_,
        index = callbacks.indexOf(callback);

    if (index === -1) return;

    callbacks.splice(index, 1);

    if (callbacks.length === 0) {
        CustomObserver.removeInstance_(this);
    }
};

/**
 * get value
 */
CustomObserver.prototype.getValue = function() {
    var length = this.propNameTokens_.length;

    return util.isObject(this.targets_[length - 1]) ?
        this.targets_[length - 1][this.propNameTokens_[length - 1]] :
        null;
};

/**
 * reset observe
 * @param {number} index reset observe depth
 * @private
 */
CustomObserver.prototype.resetObserve_ = function(index) {
    if (index >= this.propNameTokens_.length) return;

    var targets = this.targets_,
        propName = this.propNameTokens_[index],
        oldTarget = targets[index],
        newTarget;

    //unobserve
    if (util.isObject(oldTarget)) {
        Object.unobserve(oldTarget, this.onChangeHandler_);
    }

    if (index !== 0) {
        targets[index] = null;
    }

    //observe
    if (index === 0) {
        newTarget = targets[0];
    } else if (util.isObject(targets[index - 1]) &&
        util.isObject(targets[index - 1][this.propNameTokens_[index - 1]])) {

        newTarget = targets[index - 1][this.propNameTokens_[index - 1]];
    } else {
        newTarget = null;
    }

    if (newTarget) {
        Object.observe(newTarget, this.onChangeHandler_);
    }
    targets[index] = newTarget;

    this.resetObserve_(index + 1);
};

/**
 * observe callback
 * @param {[Object]} changes changes
 * @private
 */
CustomObserver.prototype.onChangeHandler_ = function(changes) {
    var newValue = this.getValue(),
        oldValue = this.oldValue_,
        targets = this.targets_;

    if (newValue !== oldValue) {
        changes = [{
            type: 'update',
            name: this.propName_,
            object: this.targets_[0],
            oldValue: oldValue,
            newValue: newValue
        }];

        this.callbacks_.forEach(function(callback) {
            if (util.isFunction(callback)) {
                callback(changes);
            } else if (util.isObject(callback) && util.isFunction(callback.handleEvent)) {
                callback.handleEvent(changes);
            }
        }, this);

        this.oldValue_ = newValue;
    }

    changes.forEach(function(change) {
        var index = targets.indexOf(change.object);

        if (index !== -1) {
            this.resetObserve_(index);
        }
    }, this);
};

window.CustomObserver = CustomObserver;
module.exports = CustomObserver;

},{"../map.js":1,"../util.js":4,"./objectobserver.js":3}],3:[function(require,module,exports){
var Map = require('../map.js');

if (typeof Object.observe !== 'function') {

    /**
     * ObjectObserver
     *
     * @constructor
     */
    function ObjectObserver(object) {
        /**
         * observe target
         * @type {Object}
         * @private
         */
        this.object_ = object;

        /**
         * listeners
         * @type {[Function]}
         * @private
         */
        this.listeners_ = [];

        /**
         * last copy of the target.
         * @type {Object}
         * @private;
         */
        this.last_ = {};
        this.compare_();

        ObjectObserver.addInstance_(this);
    }

    /**
     * Main loop timer
     * @type {number|null}
     * @private
     */
    ObjectObserver.timerID_ = null;

    /**
     * Main loop interval (ms)
     * @const {number}
     * @private
     */
    ObjectObserver.LOOP_INTERVAL_ = 60;

    /**
     * ObjectObserver instance map.
     * @type {Map}
     * @private
     */
    ObjectObserver.instances_ = new Map();

    /**
     *	cahnge type
     *	@enum {string}
     */
    ObjectObserver.ChangeType = {
        ADD: 'add',
        UPDATE: 'update',
        DELETE: 'delete'
    };

    /**
     * Add ObjectObserver isntance.
     * @param {ObjectObserver} observer observer instance.
     * @private
     */
    ObjectObserver.addInstance_ = function(observer) {
        this.instances_.set(observer.object_, observer);

        if (this.timerID_ === null) {
            this.timerID_ = setInterval(this.mainLoop, ObjectObserver.LOOP_INTERVAL_);
        }
    };

    /**
     * Get ObjectObserver isntance.
     * @param {Object} object observe target object.
     * @return {ObjectObserver} observer instance.
     * @private
     */
    ObjectObserver.getInstance_ = function(object) {
        return this.instances_.get(object);
    };

    /**
     * remove ObjectObserver isntance.
     * @param {ObjectObserver} observer observer instance.
     * @private
     */
    ObjectObserver.removeInstance_ = function(observer) {
        this.instances_.delete(observer.object_);

        if (this.instances_.size === 0) {
            clearInterval(this.timerID_);
            this.timerID_ = null;
        }
    };

    /**
     * Add change callback.
     * If the callback is added already, do nothing.
     *
     * @param {Function} callback [description]
     * @private
     */
    ObjectObserver.prototype.addListener_ = function(callback) {
        var listeners = this.listeners_,
            index = listeners.indexOf(callback);

        if (index !== -1) return;

        listeners.push(callback);
    };

    ObjectObserver.mainLoop = function() {
        this.instances_.forEach(function(instance) {
            instance.compare_();
        });
    };
    ObjectObserver.mainLoop = ObjectObserver.mainLoop.bind(ObjectObserver);

    /**
     * compare change diffs.
     * @private
     * @TODO tuneup
     */
    ObjectObserver.prototype.compare_ = function() {
        var oldObj = this.last_,
            newObj = this.object_,
            changes = [],
            newKeys = Object.getOwnPropertyNames(newObj),
            oldKeys = Object.getOwnPropertyNames(oldObj),
            i, max, key;

        for (i = 0, max = newKeys.length; i < max; i++) {
            key = newKeys[i];
            if (oldObj.hasOwnProperty(key)) {
                if (oldObj[key] !== newObj[key]) {
                    changes.push({
                        type: ObjectObserver.ChangeType.UPDATE,
                        object: newObj,
                        oldValue: oldObj[key],
                        name: key
                    });
                    oldObj[key] = newObj[key];
                }
            } else {
                changes.push({
                    type: ObjectObserver.ChangeType.ADD,
                    object: newObj,
                    name: key
                });
                oldObj[key] = newObj[key];
            }
        }

        for (i = 0, max = oldKeys.length; i < max; i++) {
            key = oldKeys[i];
            if (newKeys.indexOf(key) === -1) {
                changes.push({
                    type: ObjectObserver.ChangeType.DELETE,
                    object: newObj,
                    name: key,
                    oldValue: oldObj[key]
                });

                delete oldObj[key];
            }
        }

        if (changes.length === 0) return;
        this.publishChanges(changes);
    };

    /**
     * publish change event.
     * @param {Array} changes changes.
     */
    ObjectObserver.prototype.publishChanges = function(changes) {
        this.listeners_.forEach(function(listener) {
            listener(changes);
        });
    };

    /**
     * Remove change callback.
     * After removing, if callbacks is nothing no more,
     * this ObjectObserver instance is deleted.
     *
     * @param {Function} callback [description]
     */
    ObjectObserver.prototype.removeListener_ = function(callback) {
        var listeners = this.listeners_,
            index = listeners.indexOf(callback);

        if (index === -1) return;

        listeners.splice(index, 1);

        if (listeners.length === 0) {
            ObjectObserver.removeInstance_(observer);
        }
    };

    /**
     *	Observe object.
     *	@param {Object} object observe target object.
     *	@param {Function} callback callback.
     */
    Object.observe = function(object, callback) {
        var observer = ObjectObserver.getInstance_(object);

        if (!observer) {
            observer = new ObjectObserver(object);
        }

        observer.addListener_(callback);
    };

    /**
     *	Unobserve object.
     *	@param {Object} object observe target object.
     *	@param {Function} callback callback.
     */
    Object.unobserve = function(object, callback) {
        var observer = ObjectObserver.getInstance_(object);

        if (!observer) return;

        observer.removeListener_(callback);
    };

    module.exports = ObjectObserver;
}

},{"../map.js":1}],4:[function(require,module,exports){
var util = {};

util.inherits = function(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
    child.prototype.super = parent.prototype;
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

},{}]},{},[2]);
