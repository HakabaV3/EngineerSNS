var util = require('./util.js');

function Animation() {
    if (!(this instanceof Animation)) {
        var instance = new Animation();
        instance.then.apply(instance, arguments);
        return intstance;
    }

    /**
     * The que of animation data objects.
     * @type {[Object]}
     * @private
     */
    this.que_ = [];

    /**
     * The flag if animation is running
     * @type {Boolean}
     * @private
     */
    this.flagRunning = false;

    /**
     * The flag if animation que is waiting for transitionend event.
     * @type {Boolean}
     * @private
     */
    this.flagWaiting = false;

    /**
     * The element of the transition waiting for transitionend event.
     * @type {Element}
     * @private
     */
    this.waitingElement = null;

    // /**
    //  * The property name of the transition waiting for transitionend event.
    //  * @type {string|null}
    //  * @private
    //  */
    // this.waitingPropertyName = null;
}

Animation.prototype.then = function(element, callback, flagWait) {
    flagWait = flagWait || false;

    this.que_.push({
        element: element,
        callback: callback,
        flagWait: flagWait
    });
    if (!this.flagRunning) {
        this.flagRunning = true;
        this.doAnimation_();
    }

    return this;
};

Animation.prototype.wait = function(element, callback) {
    return this.then(element, callback, true);
};

Animation.prototype.doAnimation_ = function() {
    var que = this.que_,
        self = this,
        item;

    // wait for transitionend event.
    if (this.flagWaiting) return;

    item = que.shift();

    if (!item) {
        // que is empty
        this.flagRunning = false;
        return;
    }

    if (item.flagWait) {
        // wait for next transitionend event.
        item.element.addEventListener('transitionend', this);
        this.flagWaiting = true;
        this.waitingElement = item.element;
    }

    requestAnimationFrame(function() {
        item.callback.call(self, item.element);
        self.doAnimation_();
    });
};

Animation.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'transitionend':
            this.onTransitionEnd(ev);
            break;
    }
};

Animation.prototype.onTransitionEnd = function(ev) {
    if (!this.flagWaiting ||
        this.waitingElement !== ev.target) return;

    ev.target.removeEventListener('transitionend', this);

    this.flagWaiting = false;
    this.waitingElement = null;
    this.doAnimation_();
};

module.exports = Animation;
