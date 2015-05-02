var Controller = require('./Controller.js'),
    Template = require('../Service/Template.js'),
    Auth = require('../Model/Auth.js');

/**
 *  @constructor
 *  @param {Element} [element] base element.
 *  @extends {Controller}
 */
function ESSignInCardController(element) {
    Controller.apply(this, arguments);

    this.element = element || Template.createElement('es-signInCard');

    this.element.addEventListener('submit', this.onSubmit = this.onSubmit.bind(this));
}
inherits(ESSignInCardController, Controller);

/**
 *  sign in.
 */
ESSignInCardController.prototype.signIn = function(callback) {
    var self = this,
        userName = this.element.userName,
        password = this.element.password;

    this.element.disabled = true;
    this.element.isError = false;

    Auth.signIn(userName, password, function(err, user) {
        self.element.disabled = false;
        if (err) {
            self.element.isError = true;
            self.element.$.userName.focus();
        } else {
            self.fire('signin', user);
            self.element.clear();
        }
    });
};

/**
 *  callback of element#submit
 */
ESSignInCardController.prototype.onSubmit = function(ev) {
    this.signIn();
};

module.exports = ESSignInCardController;
