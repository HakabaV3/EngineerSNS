//@include ../../model/project.js

var ProjectView = React.createClass({displayName: "ProjectView",
	render: function(){
		var project = this.props.project;

		if (!project) {
			return (
				React.createElement("div", {className: "ProjectView"}
				)
			);
		}

		return (
			React.createElement("div", {className: "ProjectView"}, 
				React.createElement("p", null, 
					"プロジェクト:", React.createElement("b", null, project.name)
				), 
				React.createElement("table", null, 
					React.createElement("tr", null, 
						React.createElement("td", null, "id"), 
						React.createElement("td", null, project.id)
					)
				)
			)
		);
	}
});