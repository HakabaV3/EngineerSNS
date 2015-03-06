//@include ./toolbarview.js
//@include ./userpageview.js
//@include ./projectpageview.js
//@include ./error404view.js

var BaseView = React.createClass({
	getInitialState: function(){
		return {
			mode: ''
		};
	},
	componentDidMount: function(){
		this.onChangeRout = this.onChangeRout.bind(this);

		app.on(Application.Event.CHANGE_ROUT, this.onChangeRout);

		this.onChangeRout(app.rout);
	},
	componentWillUnmount: function(){
		app.off(Application.Event.CHANGE_ROUT, this.onChangeRout);

		this.onChangeRout = null;
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
					<div className="BaseView">
						<ToolBarView />
						<UserPageView />
					</div>
				);
				break;

			case 'project':
				return (
					<div className="BaseView">
						<ToolBarView />
						<ProjectPageView />
					</div>
				);
				break;

			case 'error':
				return (
					<div className="BaseView">
						<ToolBarView />
						<Error404View />
					</div>
				);
				break;

			default:
				return (
					<div className="BaseView">
						<ToolBarView />
					</div>
				);
				break;
		}
	}
});