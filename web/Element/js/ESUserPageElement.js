require('./SAInputElement.js');
require('./SAButtonElement.js');

var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function ESUserPageElement() {
    CustomElement.apply(this, arguments);
}
inherits(ESUserPageElement, CustomElement);

/**
 *  clear all value
 */
ESUserPageElement.prototype.clear = function() {
    this.userName = '';
};

CustomElement.registerConstructor(ESUserPageElement);

module.exports = ESUserPageElement;
