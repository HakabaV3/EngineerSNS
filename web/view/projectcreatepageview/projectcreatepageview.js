var View = require('../view/view.js'),
    UserInlineView = require('../userinlineview/userinlineview.js'),
    CardView = require('../cardview/cardview.js'),
    util = require('../../service/util.js'),
    User = require('../../model/user.js'),
    Project = require('../../model/project.js');

function ProjectCreatePageView() {
    View.apply(this, arguments);

    this.user;
    this.setUser(null);

    window.addEventListener('auth.change', this);
}
util.inherits(ProjectCreatePageView, View);

ProjectCreatePageView.prototype.setUser = function(user) {
    this.user = user;
    this.childViews.userInlineView.setUser(user);
};

ProjectCreatePageView.prototype.setUserName = function(userName) {
    var self = this;
    User.getByName(userName, function(err, user) {
        if (err) {
            return;
        }

        self.setUser(user);
    });
};

ProjectCreatePageView.prototype.handleEvent = function(ev) {
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

ProjectCreatePageView.prototype.onAuthChange = function() {
    this.childViews.userInlineView.setUser(app.authedUser);
};

ProjectCreatePageView.setViewConstructor('ProjectCreatePageView');

module.exports = ProjectCreatePageView;
