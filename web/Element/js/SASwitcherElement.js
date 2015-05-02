var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function SASwitcherElement($) {
    CustomElement.apply(this, arguments);
}
inherits(SASwitcherElement, CustomElement);

/**
 *  show ripple-start effect with center position is (x, y);
 *  @param {number} [x=0] center position x.
 *  @param {number} [y=0] center position y.
 */
SASwitcherElement.prototype.switch = function(index) {

    var children = this.children,
        nextPage = this.children[index],
        i, max, currentPage;

    for (i = 0, max = children.length; i < max; i++) {
        if (children[i].hasAttribute('visible')) {
            currentPage = children[i];
            break;
        }
    }

    if (currentPage) {
        currentPage.removeAttribute('visible');
    }

    if (nextPage) {
        nextPage.setAttribute('visible', '');
    }
};

CustomElement.registerConstructor(SASwitcherElement);

module.exports = SASwitcherElement;
