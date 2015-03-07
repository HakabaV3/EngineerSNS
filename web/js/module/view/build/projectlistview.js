//@include ./projectlistitemview.js
//@include ../../model/project.js

var ProjectListView = React.createClass({displayName: "ProjectListView",
	render: function(){
		var projects = this.props.projects || [];

		return (
			React.createElement("ul", {className: "ProjectListView CardView"}, 
				React.createElement("header", {className: "CardView-header"}, 
					"プロジェクト一覧"
				), 
			projects.map(function(project){
				return React.createElement(ProjectListItemView, {key: project.uri, project: project})
			})
			)
		);
	}
});