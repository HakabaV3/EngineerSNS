require('./SAInputElement.js');
require('./SAButtonElement.js');

var CustomElement = require('./CustomElement.js');

/**
 *  @constructor
 *  @extends {CustomElement}
 */
function ESSignInCardElement() {
    CustomElement.apply(this, arguments);

    this.$.form.addEventListener('submit', this.onFormSubmit = this.onFormSubmit.bind(this));
}
inherits(ESSignInCardElement, CustomElement);

/**
 *  clear all value
 */
ESSignInCardElement.prototype.clear = function() {
    this.userName = '';
    this.password = '';
    this.blur();
};

/**
 *  callback of $.form#submit
 *  @param {Event} ev event object.
 */
ESSignInCardElement.prototype.onFormSubmit = function(ev) {
    var isInValid = false,
        userName = this.userName,
        password = this.password;

    if (!password) {
        isInValid = true;
        this.$.password.isError = true;
        this.$.password.focus();
    } else {
        this.$.password.isError = false;
    }

    if (!userName) {
        isInValid = true;
        this.$.userName.isError = true;
        this.$.userName.focus();
    } else {
        this.$.userName.isError = false;
    }

    if (isInValid) {
        ev.stopImmediatePropagation();
    }

    ev.preventDefault();
    return false;
};

CustomElement.registerConstructor(ESSignInCardElement);

module.exports = ESSignInCardElement;
