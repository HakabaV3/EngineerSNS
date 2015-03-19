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

module.exports = CustomObserver;
