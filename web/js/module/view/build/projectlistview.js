//@include ./projectlistitemview.js
//@include ../../model/project.js

var ProjectListView = React.createClass({displayName: "ProjectListView",
	render: function(){
		var projects = this.props.projects || [],
			items = projects.map(function(project){
				return (
					React.createElement(ProjectListItemView, {project: project})
				)
			});

		return (
			React.createElement("ul", {className: "ProjectListView"}, 
				items
			)
		);
	}
});