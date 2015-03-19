var View = require('../view/view.js'),
    UserInlineView = require('../userinlineview/userinlineview.js'),
    ProjectInlineView = require('../projectinlineview/projectinlineview.js'),
    CardView = require('../cardview/cardview.js'),
    util = require('../../service/util.js'),
    User = require('../../model/user.js');

function UserPageView() {
    View.apply(this, arguments);

    this.user;
    this.setUser(null);

    window.addEventListener('auth.change', this);
}
util.inherits(UserPageView, View);

UserPageView.prototype.setUser = function(user) {
    this.user = user;
    this.childViews.userInlineView.setUser(user);
    this.loadUserProjects();
};

UserPageView.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

UserPageView.prototype.loadUserProjects = function() {
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

UserPageView.prototype.setProjects = function(projects) {
    var container = this.childViews.projectContainer;

    container.$.content.innerHTML = '';

    projects.forEach(function(project) {
        var view = new ProjectInlineView();
        view.setProject(project);
        container.appendChild(view);
    });
}

UserPageView.prototype.handleEvent = function(ev) {
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

UserPageView.prototype.onAuthChange = function() {
    this.childViews.userInlineView.setUser(app.authedUser);
};

UserPageView.setViewConstructor('UserPageView');

module.exports = UserPageView;
