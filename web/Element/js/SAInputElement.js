var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SAInputElement($) {
    CustomElement.apply(this, arguments);

    $.input.addEventListener('focus', this.onInputFocus = this.onInputFocus.bind(this));
    $.input.addEventListener('blur', this.onInputBlur = this.onInputBlur.bind(this));
    $.input.addEventListener('input', this.onInputInput = this.onInputInput.bind(this));
}
inherits(SAInputElement, CustomElement);

/**
 *  updateValueAttr_
 *  @private
 */
SAInputElement.prototype.__defineSetter__('value', function(newVal) {
    this.$.input.value = newVal;
});

/**
 *  set focus
 *  @override
 */
SAInputElement.prototype.focus = function() {
    return this.$.input.focus();
};

/**
 *  updateValueAttr_
 *  @private
 */
SAInputElement.prototype.updateValueAttr_ = function() {
    this.$.input.setAttribute('value', this.$.input.value);
};

/**
 *  callback of $.input#focus
 *  @param {Event} ev event object
 */
SAInputElement.prototype.onInputFocus = function(ev) {
    this.setAttribute('focus', '');
};

/**
 *  callback of $.input#blur
 *  @param {Event} ev event object
 */
SAInputElement.prototype.onInputBlur = function(ev) {
    this.removeAttribute('focus');
};

/**
 *  callback of $.input#blur
 *  @param {Event} ev event object
 */
SAInputElement.prototype.onInputInput = function(ev) {
    this.updateValueAttr_();
};

CustomElement.registerConstructor(SAInputElement);

module.exports = SAInputElement;
