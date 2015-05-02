//@include ../service/service/util.js'
//@include ../model/project.js
//@include listitemview.js

var ProjectListItemView = function() {
    ListItemView.call(this);

    this.loadTemplate('ProjectListItemView');

    this.project = null;
};
extendClass(ProjectListItemView, ListItemView);

ProjectListItemView.prototype.setModel = function(project) {
    this.project = project;
};
