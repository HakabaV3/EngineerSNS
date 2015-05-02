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
