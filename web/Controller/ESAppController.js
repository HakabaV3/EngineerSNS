var Controller = require('./Controller.js'),
    Template = require('../Service/Template.js'),
    ESSignInCardController = require('./ESSignInCardController.js'),
    User = require('../Model/User.js');

/**
 *  @constructor
 *  @param {Element} [element] base element.
 *  @extends {Controller}
 */
function ESAppController(element) {
    Controller.apply(this, arguments);

    this.element = element || Template.createElement('es-app');

    /**
     *  @type {ESSignInCardController}
     */
    this.signInCardController = new ESSignInCardController(this.element.$.signInCard);

    this.initEventHandler();
}
inherits(ESAppController, Controller);

/**
 *  Initialize eventhandlers.
 */
ESAppController.prototype.initEventHandler = function() {
    this.signInCardController.on('signin', this.onSignIn, this);
};

/**
 *  callback of ESSignInCardController#signin.
 *  @param {User} user authorized user.
 */
ESAppController.prototype.onSignIn = function(user) {
    console.log(user);
    this.element.authedUser = user;
    this.element.$.switcher.switch(1);
    this.element.$.userPage.user = user;
};

module.exports = ESAppController;
