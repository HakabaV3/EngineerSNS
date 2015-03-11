//@include ../service/util.js
//@include ../model/user.js
//@include ../model/project.js
//@include view.js

var UserPageView = function() {
    View.call(this);

    this.loadTemplate('UserPageView');

    this.user = null;

    app.on('rout.change', this.onChangeRout = this.onChangeRout.bind(this));
};
extendClass(UserPageView, View);

UserPageView.prototype.finalize = function() {
    app.off('rout.change', this.onChangeRout);
    this.onChangeRout = null;

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
            self.childViews.projectListView.setItems([]);
        } else {
            self.childViews.projectListView.setItems(projects);
        }
    });
};

UserPageView.prototype.setUser = function(user) {
    if (this.user === user) return;

    this.user = user;
    this.childViews.userView.setUser(user);
    this.loadUserProjects();
};

UserPageView.prototype.onChangeRout = function(rout) {
    this.loadUserWithRout(rout);
};
