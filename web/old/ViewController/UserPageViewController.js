var ViewController = require('./ViewController.js'),
    UserInlineViewController = require('./UserInlineViewController.js'),
    ProjectInlineViewController = require('./ProjectInlineViewController.js'),
    util = require('../Service/util.js'),
    User = require('../Model/user.js'),
    Template = require('../Service/Template/Template.js');

function UserPageViewController() {
    ViewController.apply(this, arguments);

    this.user;
    this.setUser(null);

    window.addEventListener('auth.change', this);
}
util.inherits(UserPageViewController, ViewController);

UserPageViewController.prototype.setUser = function(user) {
    this.user = user;
    this.$.userInlineView.controller.setUser(user);
    this.loadUserProjects();
};

UserPageViewController.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

UserPageViewController.prototype.loadUserProjects = function() {
    var user = this.user,
        self = this;
    if (!user) return;

    user.getAllProjects(function(err, projects) {
        if (err) {
            return;
        }

        self.setProjects(projects);
    });
};

UserPageViewController.prototype.setProjects = function(projects) {
    var container = this.$.projectContainer;

    container.innerHTML = '';

    projects.forEach(function(project) {
        var view = Template.create('ProjectInlineView');
        view.controller.setProject(project);
        container.appendChild(view.root);
    });
}

UserPageViewController.prototype.handleEvent = function(ev) {
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

UserPageViewController.prototype.onAuthChange = function() {
    this.$.userInlineView.controller.setUser(app.authedUser);
};

UserPageViewController.registerController('UserPageViewController');

module.exports = UserPageViewController;
