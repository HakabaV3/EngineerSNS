var ViewController = require('./ViewController.js'),
    UserInlineViewController = require('./UserInlineViewController.js'),
    util = require('../Service/util.js'),
    User = require('../Model/User.js'),
    Project = require('../Model/Project.js');

function ProjectCreatePageViewController() {
    ViewController.apply(this, arguments);

    this.user;
    this.setUser(null);

    window.addEventListener('auth.change', this);
}
util.inherits(ProjectCreatePageViewController, ViewController);

ProjectCreatePageViewController.prototype.setUser = function(user) {
    this.user = user;
    this.$.userInlineView.controller.setUser(user);
};

ProjectCreatePageViewController.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

ProjectCreatePageViewController.prototype.handleEvent = function(ev) {
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

ProjectCreatePageViewController.prototype.onAuthChange = function() {
    this.$.userInlineView.controller.setUser(app.authedUser);
};

ProjectCreatePageViewController.registerController('ProjectCreatePageViewController');

module.exports = ProjectCreatePageViewController;
