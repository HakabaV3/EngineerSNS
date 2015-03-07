var ToolBarView = React.createClass({
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
			<div className="ToolBarView">
				<div className="grid-container">
					<div className="grid-12">
						<div className="ToolBarView-left">
							<span className="ToolBarView-title">EngineerSNS</span>
						</div>

						<div className="ToolBarView-right">
							<span className="ToolBarView-auth">{stateMsg}</span>			
						</div>
					</div>
				</div>
			</div>
		);
	}
});