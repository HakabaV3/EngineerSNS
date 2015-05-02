var ViewController = require('./ViewController.js'),
    RippleViewController = require('./RippleViewController.js'),
    util = require('../Service/util.js');

function ButtonViewController() {
    ViewController.apply(this, arguments);

    this.$.root.addEventListener('click', this);
    this.$.root.addEventListener('mousedown', this);
    this.$.root.addEventListener('mouseup', this);
    this.$.root.addEventListener('keydown', this);

    this.$.root.setAttribute('tabindex', 0);
}
util.inherits(ButtonViewController, ViewController);

ButtonViewController.prototype.setDisabled = function(disabled) {
    if (disabled === this.disabled) return;

    if (disabled) {
        this.$.root.setAttribute('disabled', 'disabled');
    } else {
        this.$.root.removeAttribute('disabled');
    }
};
ButtonViewController.prototype.__defineSetter__('disabled', ButtonViewController.prototype.setDisabled);

ButtonViewController.prototype.getDisabled = function() {
    return this.$.root.hasAttribute('disabled');
};
ButtonViewController.prototype.__defineGetter__('disabled', ButtonViewController.prototype.getDisabled);

ButtonViewController.prototype.handleEvent = function(ev) {
    var KEYCODE_ENTER = 13;

    switch (ev.type) {
        case 'click':
            if (this.disabled) {
                ev.stopPropagation();
                ev.preventDefault();
            }
            break;

        case 'mousedown':
            if (this.disabled) {
                return;
            }
            this.onMouseDown(ev);
            break;

        case 'mouseup':
            if (this.disabled) {
                return;
            }
            this.onMouseUp(ev);
            break;

        case 'keydown':
            if (ev.keyCode !== KEYCODE_ENTER || this.disabled) {
                return;
            }
            this.onPressEnter(ev);
            break;
    }
};

ButtonViewController.prototype.onMouseDown = function(ev) {
    var gcr = this.$.root.getBoundingClientRect(),
        x = ev.clientX - gcr.left,
        y = ev.clientY - gcr.top;

    this.$.ripple.controller.rippleIn(x, y);
};

ButtonViewController.prototype.onMouseUp = function(ev) {
    this.$.ripple.controller.rippleOut();
};

ButtonViewController.prototype.onPressEnter = function(ev) {
    var gcr = this.$.root.getBoundingClientRect();

    this.$.ripple.controller.rippleIn(gcr.width / 2, gcr.height / 2);
    this.$.ripple.controller.rippleOut();
    this.$.root.click();
};

ButtonViewController.registerController('ButtonViewController');

module.exports = ButtonViewController;