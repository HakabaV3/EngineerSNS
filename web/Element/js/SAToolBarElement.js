var CustomElement = require('./CustomElement.js'),
    ESUserInlineElement = require('./ESUserInlineElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SAToolBarElement($) {
    CustomElement.apply(this, arguments);
}
inherits(SAToolBarElement, CustomElement);

CustomElement.registerConstructor(SAToolBarElement);

module.exports = SAToolBarElement;
