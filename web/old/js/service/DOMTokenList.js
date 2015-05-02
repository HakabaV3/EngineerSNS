var DOMTokenList = window.DOMTokenList;

/**
 *	DOMTokenList Polyfill
 */
if (!DOMTokenList) {

    DOMTokenList = function DOMTokenList(element, attrName) {
        /**
         * @type {Element}
         * @private
         */
        this.element_ = element;

        /**
         * @type {string}
         * @private
         */
        this.attrName_ = attrName;
    }

    /**
     * delimiter
     * @const {String}
     * @private
     */
    DOMTokenList.DELIMITER_ = ' ';

    /**
     * length
     * @type {number}
     */
    DOMTokenList.prototype.__defineGetter__('length', function() {
        return this.getItems_().length;
    });

    /**
     * Returns original attribute value.
     * @return {string} original attribute value.
     * @private
     */
    DOMTokenList.prototype.getOriginal_ = function() {
        return this.element_.getAttribute(this.attrName_);
    };

    /**
     * Sets original attribute value.
     * @param {string} newValue attribute value.
     * @private
     */
    DOMTokenList.prototype.setOriginal_ = function(newValue) {
        this.element_.setAttribute(this.attrName_, newValue);
    };

    /**
     * Returns original attribute value as array.
     * @return {[string]} original attribute value.
     * @private
     */
    DOMTokenList.prototype.getItems_ = function() {
        return this.getOriginal_().split(DOMTokenList.DELIMITER_);
    };

    /**
     * Sets original attribute value with array.
     * @param {[string]} items attribute value.
     * @private
     */
    DOMTokenList.prototype.setItems_ = function(items) {
        this.setOriginal_(items.join(DOMTokenList.DELIMITER_));
    };

    /**
     * Returns item for specified index.
     * @param  {number} index specified index
     * @return {string} the item for specified index.
     */
    DOMTokenList.prototype.item = function(index) {
        return this.getItems_()[index];
    };

    /**
     * Checks if this list contains specified token.
     * @param  {string} token token.
     * @return {boolean} If contains, return true, otherwise false.
     */
    DOMTokenList.prototype.contains = function(token) {
        return this.getItems_().indexOf(token) !== -1;
    };

    /**
     * Adds token. If it's exist already, do nothing.
     * @param {string} token token.
     */
    DOMTokenList.prototype.add = function(token) {
        var items = this.getItems_(),
            i, max;

        for (i = 0, max = arguments.length; i < max; i++) {
            token = arguments[i];
            if (items.indexOf(token) !== -1) continue;
            items.push(token);
        }

        this.setItems_(items);
    };

    /**
     * Removes token. If it's not exist, do nothing.
     * @param {string} token token.
     */
    DOMTokenList.prototype.remove = function(token) {
        var items = this.getItems_(),
            i, max, index;

        for (i = 0, max = arguments.length; i < max; i++) {
            token = arguments[i];
            index = items.indexOf(token);
            if (index === -1) continue;
            items.splice(index, 1);
        }

        this.setItems_(items);
    };

    /**
     * Toggles token.
     * @param {string} token token.
     */
    DOMTokenList.prototype.toggle = function(token) {
        return this.contains(token) ?
            this.remove(token) :
            this.add(token);
    };
}

module.exports = DOMTokenList;
