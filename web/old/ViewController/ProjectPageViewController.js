var ViewController = require('./ViewController.js'),
    UserInlineViewController = require('./UserInlineViewController.js'),
    ProjectInlineViewController = require('./ProjectInlineViewController.js'),
    util = require('../Service/util.js'),
    User = require('../Model/User.js'),
    Project = require('../Model/Project.js');

function ProjectPageViewController() {
    ViewController.apply(this, arguments);

    this.user;
    this.setUser(null);

    this.project;
    this.setProject(null);

    window.addEventListener('auth.change', this);
}
util.inherits(ProjectPageViewController, ViewController);

ProjectPageViewController.prototype.setProject = function(project) {
    this.project = project;
    this.$.projectInlineView.controller.setProject(project);

    if (project) {
        this.setUserName(project.owner);
    } else {
        this.setUser(null);
    }
};

ProjectPageViewController.prototype.setProjectName = function(userName, projectName) {
    var self = this;
    Project.getByName(userName, projectName, function(err, project) {
        if (err) {
            return;
        }

        self.setProject(project);
    });
};


ProjectPageViewController.prototype.setUser = function(user) {
    this.user = user;
    this.$.userInlineView.controller.setUser(user);
};

ProjectPageViewController.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

ProjectPageViewController.prototype.handleEvent = function(ev) {
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

ProjectPageViewController.prototype.onAuthChange = function() {
    this.$.userInlineView.controller.setUser(app.authedUser);
};

ProjectPageViewController.registerController('ProjectPageViewController');

module.exports = ProjectPageViewController;
