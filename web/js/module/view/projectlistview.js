//@include ../service/util.js
//@include ../model/project.js
//@include listview.js
//@include projectlistitemview.js

var ProjectListView = function() {
    ListView.call(this);

    this.loadTemplate('ProjectListView');
    this.itemViewConstructor = ProjectListItemView;

    this.projects = [];
    this.listItems = [];
};
extendClass(ProjectListView, ListView);
