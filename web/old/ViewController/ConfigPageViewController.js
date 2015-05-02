var ViewController = require('./ViewController.js'),
    UserInlineViewController = require('./UserInlineViewController.js'),
    util = require('../Service/util.js'),
    User = require('../Model/User.js');

function ConfigPageViewController() {
    ViewController.apply(this, arguments);

    this.user;
    this.setUser(null);

    window.addEventListener('auth.change', this);
}
util.inherits(ConfigPageViewController, ViewController);

ConfigPageViewController.prototype.setUser = function(user) {
    this.user = user;
    this.$.userInlineView.controller.setUser(user);
};

ConfigPageViewController.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

ConfigPageViewController.prototype.handleEvent = function(ev) {
    switch (ev.type) {
        case 'auth.change':
            this.onAuthChange(ev);
            break;

        case 'click':
            app.signOut(function() {
                app.setHash('/signin');
            });
    }
};

ConfigPageViewController.prototype.onAuthChange = function() {
    this.$.userInlineView.controller.setUser(app.authedUser);
};

ConfigPageViewController.registerController('ConfigPageViewController');

module.exports = ConfigPageViewController;
