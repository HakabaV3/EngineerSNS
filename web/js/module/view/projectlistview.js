//@include ../service/util.js
//@include ../model/project.js
//@include view.js
//@include projectlistitemview.js

var ProjectListView = function() {
    View.call(this);

    this.loadTemplate('ProjectListView');

    this.projects = [];
    this.listItems = [];
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

    this.listItems.forEach(function(listItem) {
        listItem.finalize();
    });

    this.listItems = this.projects.map(function(project) {
        var listItem = new ProjectListItemView();
        listItem.project = project;

        self.appendChild(listItem);

        return listItem;
    });
}
