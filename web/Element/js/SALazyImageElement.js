var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SALazyImageElement($) {
    CustomElement.apply(this, arguments);

    this.addEventListener('load', this.onLoad = this.onLoad.bind(this));
    this.addEventListener('error', this.onError = this.onError.bind(this));
}
inherits(SALazyImageElement, CustomElement);

/**
 *  image source url
 *  @type {string}
 */
SALazyImageElement.prototype.__defineSetter__('src', function(newVal) {
    this.setAttribute('src', newVal);
    this.setAttribute('state', 'loading');

    if (this.complete) this.onLoad();
});

/**
 *  callback of this#load
 *  @param {Event} ev event object
 */
SALazyImageElement.prototype.onLoad = function(ev) {
    this.setAttribute('state', 'loaded');
};

/**
 *  callback of this#error
 *  @param {Event} ev event object
 */
SALazyImageElement.prototype.onError = function(ev) {
    this.setAttribute('state', 'error');
};

CustomElement.registerConstructor(SALazyImageElement);

module.exports = SALazyImageElement;
