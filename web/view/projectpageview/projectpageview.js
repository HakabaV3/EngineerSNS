var View = require('../view/view.js'),
    UserInlineView = require('../userinlineview/userinlineview.js'),
    ProjectInlineView = require('../projectinlineview/projectinlineview.js'),
    CardView = require('../cardview/cardview.js'),
    util = require('../../service/util.js'),
    User = require('../../model/user.js'),
    Project = require('../../model/project.js');

function ProjectPageView() {
    View.apply(this, arguments);

    this.user;
    this.setUser(null);

    this.project;
    this.setProject(null);

    window.addEventListener('auth.change', this);
}
util.inherits(ProjectPageView, View);

ProjectPageView.prototype.setProject = function(project) {
    this.project = project;
    this.childViews.projectInlineView.setProject(project);

    if (project) {
        this.setUserName(project.owner);
    } else {
        this.setUser(null);
    }
};

ProjectPageView.prototype.setProjectName = function(userName, projectName) {
    var self = this;
    Project.getByName(userName, projectName, function(err, project) {
        if (err) {
            return;
        }

        self.setProject(project);
    });
};


ProjectPageView.prototype.setUser = function(user) {
    this.user = user;
    this.childViews.userInlineView.setUser(user);
};

ProjectPageView.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

ProjectPageView.prototype.handleEvent = function(ev) {
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

ProjectPageView.prototype.onAuthChange = function() {
    this.childViews.userInlineView.setUser(app.authedUser);
};

ProjectPageView.setViewConstructor('ProjectPageView');

module.exports = ProjectPageView;
