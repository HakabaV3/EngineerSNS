//@include ../service/util.js
//@include ../model/project.js
//@include view.js
//@include projectlistitemview.js

var ProjectListView = function() {
    View.call(this);

    this.loadTemplate('ProjectListView');

    this.projects = [];
};
extendClass(ProjectListView, View);

ProjectListView.prototype.finalize = function() {
    View.prototype.finalize.call(this);
};

ProjectListView.prototype.setProjects = function(projects) {
    this.projects = projects;
    this.update();
};

ProjectListView.prototype.update = function() {
    var self = this;

    this.projects.forEach(function(project) {
        var projectListItemView = new ProjectListItemView();
        projectListItemView.project = project;

        self.appendChild(projectListItemView);
    })
}
