//@include ../../model/user.js

var Error404View = React.createClass({displayName: "Error404View",
	render: function(){
		return (
			React.createElement("div", {className: "Error404View"}, 
				React.createElement("h1", null, "404 Page Not Found.")
			)
		);
	}
});