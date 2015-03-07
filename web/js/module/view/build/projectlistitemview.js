//@include ../../model/project.js

var ProjectListItemView = React.createClass({displayName: "ProjectListItemView",
	render: function(){
		var project = this.props.project,
			uri;

		if (!project) {
			return (
				React.createElement("li", {className: "ProjectListItemView"}
				)
			);
		}

		uri = '#!' + project.uri;

		return (
			React.createElement("li", {className: "ProjectListItemView"}, 
				React.createElement("p", null, 
					React.createElement("a", {href: uri}, project.name)
				)
			)
		);
	}
});