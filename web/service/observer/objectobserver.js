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
