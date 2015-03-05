//@include ./toolbarview.js
//@include ./userpageview.js

var BaseView = React.createClass({displayName: "BaseView",
	render: function(){
		return (
			React.createElement("div", {className: "BaseView"}, 
				React.createElement(ToolBarView, null), 
				React.createElement(UserPageView, null)
			)
		);
	}
});