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
			React.createElement("div", {className: "ProjectView CardView"}, 
				React.createElement("header", {className: "CardView-header"}, 
					"プロジェクト:", React.createElement("b", null, project.name)
				), 
				React.createElement("section", {className: "CardView-section"}, 
					React.createElement("header", {className: "CardView-sectionHeader"}, "id"), 
					React.createElement("span", null, project.id)
				), 
				React.createElement("section", {className: "CardView-section"}, 
					React.createElement("header", {className: "CardView-sectionHeader"}, "owner"), 
					React.createElement("a", {href: '#!/user/' + project.owner}, 
						React.createElement("span", null, project.owner)
					)
				), 
				React.createElement("section", {className: "CardView-section"}, 
					React.createElement("header", {className: "CardView-sectionHeader"}, "uri"), 
					React.createElement("a", {href: '#!'+project.uri}, 
						React.createElement("span", null, project.uri)
					)
				)
			)
		);
	}
});