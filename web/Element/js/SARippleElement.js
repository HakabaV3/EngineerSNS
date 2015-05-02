var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SARippleElement($) {
    CustomElement.apply(this, arguments);
}
inherits(SARippleElement, CustomElement);

/**
 *  show ripple-start effect with center position is (x, y);
 *  @param {number} [x=0] center position x.
 *  @param {number} [y=0] center position y.
 */
SARippleElement.prototype.rippleStart = function(x, y) {
    var self = this,
        style = this.$.inner.style,
        computed = getComputedStyle(this);

    style.left = x + 'px';
    style.top = y + 'px';
    style.backgroundColor = computed.color;

    this.removeAttribute('ripple-end');
    this.removeAttribute('ripple-start');

    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            self.setAttribute('ripple-start', '');
        });
    });
};

/**
 *  show ripple-end effect
 */
SARippleElement.prototype.rippleEnd = function() {
    this.setAttribute('ripple-end', '');
};

CustomElement.registerConstructor(SARippleElement);

module.exports = SARippleElement;
