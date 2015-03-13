/**
 *  Event dispatchable object.
 *
 *  @constructor
 */
var EventDispatcher = function EventDispatcher() {
    /**
     *  The list of all event listeners attached on this.
     *
     *  @type {Object<string, Array<Function>>}
     *  @private
     */
    this.eventListeners_ = {};
};

/**
 *  Finalizer.
 */
EventDispatcher.prototype.finalize = function() {
    this.eventListeners_ = null;
};

/**
 *  attach an event listener.
 *
 *  @param {string} type event type.
 *  @param {Function} listener the event listener to attach.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.on = function(type, listener, context) {
    var listeners = this.eventListeners_[type];
    context = context || this;

    if (!listeners) {
        listeners = this.eventListeners_[type] = [];
    }

    listeners.push({
        listener: listener,
        context: context
    });

    return this;
};

/**
 *  detach the event listener.
 *  if the event listener is detached for more than twice,
 *  this method detach all of them.
 *
 *  @param {string} type event type.
 *  @param {Function} listener the event listener to detach.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.off = function(type, listener, context) {
    var listeners = this.eventListeners_[type],
        i, max;
    context = context || this;

    if (!listeners) return this;

    for (i = 0, max = listeners.length; i < max; i++) {
        if (listeners[i].listener === listener &&
            listeners[i].context === context) {
            listeners.splice(i, 1);
            i--;
            max--;
        }
    }

    return this;
};

EventDispatcher.prototype.once = function(type, listener, context) {
    var self = this,
        proxy = function() {
            self.off(type, proxy, context);
            listener.apply(this, arguments);
        };

    this.on(type, proxy, context);
};

/**
 *  fire the event.
 *
 *  @param {string} type event type.
 *  @param {...*} optArgs arguments.
 *  @return {EventDispatcher} this.
 */
EventDispatcher.prototype.fire = function(type, optArgs) {
    var listeners = this.eventListeners_[type],
        args = Array.prototype.slice.call(arguments, 1),
        i, max;

    if (!listeners) return this;

    listeners = listeners.slice(0);

    for (i = 0, max = listeners.length; i < max; i++) {
        listeners[i].listener.apply(listeners[i].context, args);
    }

    return this;
};
