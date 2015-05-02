var CustomElement = require('./CustomElement'),
    SARippleElement = require('./SARippleElement.js');

/**
 *  Enter key's keycode.
 *  @const {number}
 */
var KEYCODE_ENTER = 13;

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SAButtonElement($) {
    CustomElement.apply(this, arguments);

    this.$.ripple.addEventListener('mousedown', this.onMouseDown = this.onMouseDown.bind(this));
    this.$.ripple.addEventListener('mouseup', this.onMouseUp = this.onMouseUp.bind(this));
    this.addEventListener('keypress', this.onKeyPress = this.onKeyPress.bind(this));
    this.originalClick = HTMLButtonElement.prototype.click;
}
inherits(SAButtonElement, CustomElement);

/**
 *  show ripple-start effect with center position is (x, y);
 *  @param {number} [x=0] center position x.
 *  @param {number} [y=0] center position y.
 */
SAButtonElement.prototype.pushDown = function(x, y) {
    if (this.disabled) return;

    this.$.ripple.rippleStart(x || 0, y || 0);
};

/**
 *  show ripple-end effect.
 */
SAButtonElement.prototype.pushUp = function() {
    this.$.ripple.rippleEnd();
};

/**
 *  click this element
 *  @override
 */
SAButtonElement.prototype.click = function() {
    if (this.disabled) return;

    var gcr = this.getBoundingClientRect();
    this.pushDown(gcr.width / 2, gcr.height / 2);
    this.originalClick.apply(this, arguments);
    this.pushUp();
};

/**
 *  callback of this#mousedown
 *  @param {Event} ev event object
 */
SAButtonElement.prototype.onMouseDown = function(ev) {
    var gcr = this.getBoundingClientRect();
    this.pushDown(ev.x - gcr.left, ev.y - gcr.top);
};

/**
 *  callback of this#mouseup
 *  @param {Event} ev event object
 */
SAButtonElement.prototype.onMouseUp = function(ev) {
    this.pushUp();
};

/**
 *  callback of this#keypress
 *  @param {Event} ev event object
 */
SAButtonElement.prototype.onKeyPress = function(ev) {
    if (ev.keyCode === KEYCODE_ENTER) {
        this.click();
        ev.stopPropagation();
        ev.preventDefault();
    }
};

CustomElement.registerConstructor(SAButtonElement);

module.exports = SAButtonElement
