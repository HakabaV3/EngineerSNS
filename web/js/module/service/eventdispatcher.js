/**
 *	Event dispatchable object.
 *
 *	@constructor
 */
var EventDispatcher = function EventDispatcher() {
    /**
     *	The list of all event listeners attached on this.
     *
     * 	@type {Object<string, Array<Function>>}
     *	@private
     */
    this.eventListeners_ = {};
};

/**
 *  finalize
 */
EventDispatcher.prototype.finalize = function() {
    this.eventListeners_ = null;
};

/**
 *	attach an event listener.
 *
 *	@param {string} type event type.
 *	@param {Function} listener the event listener to attach.
 *	@return {EventDispatcher} this.
 */
EventDispatcher.prototype.on = function(type, listener) {
    var listeners = this.eventListeners_[type];

    if (!listeners) {
        listeners = this.eventListeners_[type] = [];
    }

    listeners.push(listener);

    return this;
};

/**
 *	detach the event listener.
 *	if the event listener is detached for more than twice,
 *	this method detach all of them.
 *
 *	@param {string} type event type.
 *	@param {Function} listener the event listener to detach.
 *	@return {EventDispatcher} this.
 */
EventDispatcher.prototype.off = function(type, listener) {
    var listeners = this.eventListeners_[type],
        i, max;

    if (!listeners) return this;

    for (i = 0, max = listeners.length; i < max; i++) {
        if (listeners[i] == listener) {
            listeners.splice(i, 1);
            i--;
            max--;
        }
    }

    return this;
};

/**
 *	fire the event.
 *
 *	@param {string} type event type.
 *	@param {...*} optArgs arguments.
 *	@return {EventDispatcher} this.
 */
EventDispatcher.prototype.fire = function(type, optArgs) {
    var listeners = this.eventListeners_[type],
        args = Array.prototype.slice.call(arguments, 1),
        i, max;

    if (!listeners) return this;

    for (i = 0, max = listeners.length; i < max; i++) {
        listeners[i].apply(this, args);
    }

    return this;
};
