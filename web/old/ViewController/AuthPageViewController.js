var ViewController = require('./ViewController.js'),
    AuthViewController = require('./AuthViewController.js'),
    util = require('../Service/util.js');

function AuthPageViewController() {
    ViewController.apply(this, arguments);
}
util.inherits(AuthPageViewController, ViewController);

AuthPageViewController.prototype.focus = function() {
    this.$.authView.controller.focus();
}

AuthPageViewController.registerController('AuthPageViewController');

module.exports = AuthPageViewController;
