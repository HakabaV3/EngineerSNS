//@include ../../model/user.js

var UserView = React.createClass({displayName: "UserView",
	render: function(){
		var user = this.props.user;

		if (!user) {
			return (
				React.createElement("div", {className: "UserView"}, 
					React.createElement("h2", null, "Error: User is not found.")
				)
			);
		}

		return (
			React.createElement("div", {className: "UserView"}, 
				React.createElement("p", null, 
					React.createElement("img", {src: user.icon, width: "64px", height: "64px"}), 
					React.createElement("b", null, user.name), "さんのページ"
				), 
				React.createElement("table", null, 
					React.createElement("tr", null, 
						React.createElement("td", null, "id"), 
						React.createElement("td", null, user.id)
					), 
					React.createElement("tr", null, 
						React.createElement("td", null, "uri"), 
						React.createElement("td", null, user.uri)
					), 
					React.createElement("tr", null, 
						React.createElement("td", null, "name"), 
						React.createElement("td", null, user.name)
					), 
					React.createElement("tr", null, 
						React.createElement("td", null, "description"), 
						React.createElement("td", null, user.description)
					), 
					React.createElement("tr", null, 
						React.createElement("td", null, "postCount"), 
						React.createElement("td", null, user.postCount)
					), 
					React.createElement("tr", null, 
						React.createElement("td", null, "followingCount"), 
						React.createElement("td", null, user.followingCount)
					), 
					React.createElement("tr", null, 
						React.createElement("td", null, "followedCount"), 
						React.createElement("td", null, user.followedCount)
					), 
					React.createElement("tr", null, 
						React.createElement("td", null, "reviewCount"), 
						React.createElement("td", null, user.reviewCount)
					), 
					React.createElement("tr", null, 
						React.createElement("td", null, "reviewingCount"), 
						React.createElement("td", null, user.reviewingCount)
					), 
					React.createElement("tr", null, 
						React.createElement("td", null, "reviewedCount"), 
						React.createElement("td", null, user.reviewedCount)
					), 
					React.createElement("tr", null, 
						React.createElement("td", null, "icon"), 
						React.createElement("td", null, user.icon)
					)
				)
			)
		);
	}
});