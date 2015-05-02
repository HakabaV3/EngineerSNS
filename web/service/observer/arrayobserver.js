var ObjectObserver = require('./ObjectObserver.js'),
    Map = require('../Map.js');

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
