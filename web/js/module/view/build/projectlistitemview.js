//@include ../../model/project.js

var ProjectListItemView = React.createClass({displayName: "ProjectListItemView",
	render: function(){
		var project = this.props.project,
			uri;

		if (!project) {
			return (
				React.createElement("li", {className: "ProjectListItemView CardView-section"}, 
					"(Internal Error)"
				)
			);
		}

		uri = '#!' + project.uri;

		return (
			React.createElement("a", {href: uri, className: "ProjectListItemView CardView-section"}, 
				React.createElement("li", null, 
					project.name
				)
			)
		);
	}
});