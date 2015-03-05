//@include ./toolbarview.js
//@include ./userpageview.js

var BaseView = React.createClass({
	render: function(){
		return (
			<div className="BaseView">
				<ToolBarView />
				<UserPageView />
			</div>
		);
	}
});