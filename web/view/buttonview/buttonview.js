var View = require('../view/view.js'),
    RippleView = require('../rippleview/rippleview.js');
util = require('../../service/util.js');

function ButtonView() {
    View.apply(this, arguments);

    this.$.root.addEventListener('click', this);
    this.$.root.addEventListener('mousedown', this);
    this.$.root.addEventListener('mouseup', this);
    this.$.root.addEventListener('keydown', this);

    this.$.root.setAttribute('tabindex', 0);
}
util.inherits(ButtonView, View);

ButtonView.prototype.setDisabled = function(disabled) {
    if (disabled === this.disabled) return;

    if (disabled) {
        this.$.root.setAttribute('disabled', 'disabled');
    } else {
        this.$.root.removeAttribute('disabled');
    }
};
ButtonView.prototype.__defineSetter__('disabled', ButtonView.prototype.setDisabled);

ButtonView.prototype.getDisabled = function() {
    return this.$.root.hasAttribute('disabled');
};
ButtonView.prototype.__defineGetter__('disabled', ButtonView.prototype.getDisabled);

ButtonView.prototype.handleEvent = function(ev) {
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

ButtonView.prototype.onMouseDown = function(ev) {
    var gcr = this.$.root.getBoundingClientRect(),
        x = ev.clientX - gcr.left,
        y = ev.clientY - gcr.top;

    this.childViews.ripple.rippleIn(x, y);
};

ButtonView.prototype.onMouseUp = function(ev) {
    this.childViews.ripple.rippleOut();
};

ButtonView.prototype.onPressEnter = function(ev) {
    var gcr = this.$.root.getBoundingClientRect();

    this.childViews.ripple.rippleIn(gcr.width / 2, gcr.height / 2);
    this.childViews.ripple.rippleOut();
    this.$.root.click();
};

ButtonView.setViewConstructor('ButtonView');

module.exports = ButtonView;
