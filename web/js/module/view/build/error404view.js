//@include ../../model/user.js

var Error404View = React.createClass({displayName: "Error404View",
	render: function(){
		return (
			React.createElement("div", {className: "Error404View grid-container"}, 
				React.createElement("div", {className: "grid-12"}, 
					React.createElement("h1", null, "404 Page Not Found.")
				)
			)
		);
	}
});