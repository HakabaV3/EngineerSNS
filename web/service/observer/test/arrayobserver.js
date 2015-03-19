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
var ObjectObserver = require('./objectobserver.js'),
    Map = require('../map.js');

if (typeof Array.observe !== 'function') {

    /**
     * ArrayObserver
     *
     * @constructor
     */
    function ArrayObserver(array) {
        /**
         * observe target
         * @type {Array}
         * @private
         */
        this.array_ = array;

        /**
         * listeners
         * @type {[Function]}
         * @private
         */
        this.listeners_ = [];

        this.onChangeListener_ = this.onChangeListener_.bind(this);

        ArrayObserver.addInstance_(this);
    }

    /**
     * ArrayObserver instance map.
     * @type {Map}
     * @private
     */
    ArrayObserver.instances_ = new Map();

    /**
     *	cahnge type
     *	@enum {string}
     */
    ArrayObserver.ChangeType = {
        ADD: 'add',
        UPDATE: 'update',
        DELETE: 'delete',
        SPLICE: 'splice'
    };

    /**
     * Add ArrayObserver isntance.
     * @param {ArrayObserver} observer observer instance.
     * @private
     */
    ArrayObserver.addInstance_ = function(observer) {
        this.instances_.set(observer.array_, observer);

        Object.observe(observer.array_, observer.onChangeListener_);
    };

    /**
     * Get ArrayObserver isntance.
     * @param {Array} array observe target array.
     * @return {ArrayObserver} observer instance.
     * @private
     */
    ArrayObserver.getInstance_ = function(array) {
        return this.instances_.get(array);
    };

    /**
     * remove ArrayObserver isntance.
     * @param {ArrayObserver} observer observer instance.
     * @private
     */
    ArrayObserver.removeInstance_ = function(observer) {
        this.instances_.delete(observer.array_);

        Object.unobserve(observer.array_, this.onChangeListener_);
        this.onChangeListener_ = null;
    };

    /**
     * Add change callback.
     * If the callback is added already, do nothing.
     *
     * @param {Function} callback [description]
     * @private
     */
    ArrayObserver.prototype.addListener_ = function(callback) {
        var listeners = this.listeners_,
            index = listeners.indexOf(callback);

        if (index !== -1) return;

        listeners.push(callback);
    };

    /**
     * Object.observe() callback function.
     * @param {Array} changes changes
     * @private
     */
    ArrayObserver.prototype.onChangeListener_ = function(changes) {
        /**
         * If changes contains {type:'update', name:'length'},
         * this change must be replace to {type:'splice'}.
         */

        var array = this.array_,
            newLength = array.length,
            oldLength,
            removed,
            addedCount,
            changeI, changeJ, i, j, max, j;

        for (i = 0, max = changes.length; i < max; i++) {
            changeI = changes[i];

            if (changeI.name !== 'length' || changeI.type !== ArrayObserver.ChangeType.UPDATE) continue;

            oldLength = changeI.oldValue;
            addedCount = newLength - oldLength;
            removed = [];

            if (addedCount < 0) {
                removed.length = -addedCount;
                addedCount = 0;

                for (j = 0; j < max; j++) {
                    changeJ = changes[j];

                    if (changeI.name === 'length' || changeJ.type !== ArrayObserver.ChangeType.DELETE) continue;

                    removed[Number(changeJ.name) - newLength] = changeJ.oldValue;
                }
            }

            changes = [{
                type: ArrayObserver.ChangeType.SPLICE,
                object: array,
                index: newLength,
                removed: removed,
                addedCount: addedCount
            }];

            break;
        }

        this.publishChanges(changes);
    };

    /**
     * publish change event.
     * @param {Array} changes changes.
     */
    ArrayObserver.prototype.publishChanges = function(changes) {
        this.listeners_.forEach(function(listener) {
            listener(changes);
        });
    };

    /**
     * Remove change callback.
     * After removing, if callbacks is nothing no more,
     * this ArrayObserver instance is deleted.
     *
     * @param {Function} callback [description]
     */
    ArrayObserver.prototype.removeListener_ = function(callback) {
        var listeners = this.listeners_,
            index = listeners.indexOf(callback);

        if (index === -1) return;

        listeners.splice(index, 1);

        if (listeners.length === 0) {
            ArrayObserver.removeInstance_(observer);
        }
    };

    /**
     *	Observe array.
     *	@param {Array} array observe target array.
     *	@param {Function} callback callback.
     */
    Array.observe = function(array, callback) {
        var observer = ArrayObserver.getInstance_(array);

        if (!observer) {
            observer = new ArrayObserver(array);
        }

        observer.addListener_(callback);
    };

    /**
     *	Unobserve array.
     *	@param {Array} array observe target array.
     *	@param {Function} callback callback.
     */
    Array.unobserve = function(array, callback) {
        var observer = ArrayObserver.getInstance_(array);

        if (!observer) return;

        observer.removeListener_(callback);
    };

    module.exports = ArrayObserver;
}

},{"../map.js":1,"./objectobserver.js":3}],3:[function(require,module,exports){
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

},{"../map.js":1}]},{},[2]);
