//@include ../../model/user.js

var UserView = React.createClass({displayName: "UserView",
	render: function(){
		var user = this.props.user;

		if (!user) {
			return (
				React.createElement("div", {className: "UserView"}
				)
			);
		}

		return (
			React.createElement("div", {className: "UserView CardView"}, 
				React.createElement("header", {className: "CardView-header"}, 
					"ユーザー情報"
				), 
				React.createElement("section", {className: "CardView-section"}, 
					React.createElement("p", {className: "CardView-sectionHeader"}, "name"), 
					React.createElement("span", null, user.name)
				), 
				React.createElement("section", {className: "CardView-section"}, 
					React.createElement("p", {className: "CardView-sectionHeader"}, "id"), 
					React.createElement("span", null, user.id)
				), 
				React.createElement("section", {className: "CardView-section"}, 
					React.createElement("p", {className: "CardView-sectionHeader"}, "uri"), 
					React.createElement("a", {href: '#!'+user.uri}, 
						React.createElement("span", null, user.uri)
					)
				), 
				React.createElement("section", {className: "CardView-section"}, 
					React.createElement("p", {className: "CardView-sectionHeader"}, "description"), 
					React.createElement("span", null, user.description)
				)
			)
		);
	}
});