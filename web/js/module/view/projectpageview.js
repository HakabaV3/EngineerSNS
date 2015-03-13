//@include ../service/util.js
//@include view.js
//@include ../model/project.js

var ProjectPageView = function() {
    View.call(this);

    /**
     *  @type {Project}
     */
    this.project = null;

    this.loadTemplate('ProjectPageView');

    app.on('rout.change', this.onChangeRout, this);
};
extendClass(ProjectPageView, View);

ProjectPageView.prototype.finalize = function() {
    app.off('rout.change', this.onChangeRout, this);

    View.prototype.finalize.call(this);
};

ProjectPageView.prototype.loadProjectWithRout = function(rout) {
    if (rout.mode !== 'project') return;

    var self = this;

    Project.getByName(rout.userName, rout.projectName, function(err, project) {
        self.setProject(project);
        self.fire('load');
    });

    User.getByName(rout.userName, function(err, user) {
        self.childViews.userInlineView.setUser(user);
    });
};

ProjectPageView.prototype.onChangeRout = function(rout) {
    this.loadProjectWithRout(rout);
};

ProjectPageView.prototype.setProject = function(project) {
    if (this.project === project) return;

    this.project = project;
    this.childViews.commentListView.setTarget(project);
};
