//@include ../service/util.js
//@include ../model/user.js
//@include ../model/project.js
//@include view.js

var UserPageView = function() {
    View.call(this);

    this.loadTemplate('UserPageView');

    this.user = null;
    this.projects = [];

    app.on(Application.Event.CHANGE_ROUT, this.onChangeRout = this.onChangeRout.bind(this));
};
extendClass(UserPageView, View);

UserPageView.prototype.finalize = function() {
    app.off(Application.Event.CHANGE_ROUT, this.onChangeRout);

    if (this.user) {
        this.user.off('update', this.onModelUpdate);
    }

    View.prototype.finalize.call(this);
};

UserPageView.prototype.loadUserWithRout = function(rout) {
    if (rout.mode !== 'user') return;

    var self = this;

    User.getByName(rout.userName, function(err, user) {
        self.setUser(user);
    });
};

UserPageView.prototype.loadUserProjects = function() {
    var user = this.user,
        self = this;

    if (!user) return;

    user.getAllProjects(function(err, projects) {
        if (err) {
            self.projects = [];
            self.childViews.projectListView.setProjects([]);
        } else {
            self.projects = projects;
            self.childViews.projectListView.setProjects(projects);
        }
    });
};

UserPageView.prototype.setUser = function(user) {
    if (this.user === user) return;

    if (this.user) {
        this.user.off('update', this.onModelUpdate);
    }

    this.user = user;
    this.childViews.userView.user = user;
    this.projects = [];

    if (user) {
        user.on('update', this.onModelUpdate);
        this.loadUserProjects();
    }
};

UserPageView.prototype.onChangeRout = function(rout) {
    this.loadUserWithRout(rout);
};

UserPageView.prototype.onModelUpdate = function() {};
