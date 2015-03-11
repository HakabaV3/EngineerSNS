//@include ../service/util.js
//@include ../model/project.js
//@include view.js

var ProjectListItemView = function() {
    View.call(this);

    this.loadTemplate('ProjectListItemView');

    this.project = null;
};
extendClass(ProjectListItemView, View);

ProjectListItemView.prototype.finalize = function() {
    View.prototype.finalize.call(this);
};
