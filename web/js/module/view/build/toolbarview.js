var ToolBarView = React.createClass({displayName: "ToolBarView",
	componentDidMount: function(){
		this.onAppChangeAuthState = this.onAppChangeAuthState;

		app.on(Application.Event.CHANGE_AUTH_STATE, this.onAppChangeAuthState);
	},
	componentDidUnmount: function(){
		app.off(Application.Event.CHANGE_AUTH_STATE, this.onAppChangeAuthState);
	},
	onAppChangeAuthState: function(){
		this.forceUpdate();
	},
	render: function(){
		var stateMsg = app.isAuthed ? app.authedUser.name : 'ログインする';

		return (
			React.createElement("div", {className: "ToolBarView"}, 
				React.createElement("div", {className: "grid-container"}, 
					React.createElement("div", {className: "grid-12"}, 
						React.createElement("div", {className: "ToolBarView-left"}, 
							React.createElement("span", {className: "ToolBarView-title"}, "EngineerSNS")
						), 

						React.createElement("div", {className: "ToolBarView-right"}, 
							React.createElement("span", {className: "ToolBarView-auth"}, stateMsg)			
						)
					)
				)
			)
		);
	}
});