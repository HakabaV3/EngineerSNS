//@include ./toolbarview.js
//@include ./userpageview.js
//@include ./projectpageview.js
//@include ./error404view.js

var BaseView = React.createClass({displayName: "BaseView",
	getInitialState: function(){
		return {
			mode: ''
		};
	},
	componentDidMount: function(){
		this.onChangeRout = this.onChangeRout;

		app.on(Application.Event.CHANGE_ROUT, this.onChangeRout);

		this.onChangeRout(app.rout);
	},
	componentWillUnmount: function(){
		app.off(Application.Event.CHANGE_ROUT, this.onChangeRout);
	},

	onChangeRout: function(rout) {
		this.setState({
			mode: rout.mode
		});
	},

	render: function(){
		switch (this.state.mode) {
			case 'user':
				return (
					React.createElement("div", {className: "BaseView"}, 
						React.createElement(ToolBarView, null), 
						React.createElement(UserPageView, null)
					)
				);
				break;

			case 'project':
				return (
					React.createElement("div", {className: "BaseView"}, 
						React.createElement(ToolBarView, null), 
						React.createElement(ProjectPageView, null)
					)
				);
				break;

			case 'error':
				return (
					React.createElement("div", {className: "BaseView"}, 
						React.createElement(ToolBarView, null), 
						React.createElement(Error404View, null)
					)
				);
				break;

			default:
				return (
					React.createElement("div", {className: "BaseView"}, 
						React.createElement(ToolBarView, null)
					)
				);
				break;
		}
	}
});