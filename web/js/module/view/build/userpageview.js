//@include ./userview.js

var UserPageView = React.createClass({displayName: "UserPageView",
	getInitialState: function(){
		return {
			user: null
		};
	},
	componentDidMount: function(){
		app.on(Application.Event.CHANGE_ROUT, this.onChangeRout);

		this.onChangeRout = this.onChangeRout.bind(this);
		this.onModelUpdate = this.onModelUpdate.bind(this);

		this.loadUserWithRout(app.rout);
	},
	componentWillUnmount: function(){
		app.off(Application.Event.CHANGE_ROUT, this.onChangeRout);

		this.onChangeRout = null;
		this.onModelUpdate = null;
	},

	onChangeRout: function(rout) {
		this.loadUserWithRout(rout);
	},
	onChangeUser: function(user) {
		this.setUser(user);
	},
	onModelUpdate: function(){
		this.forceUpdate();
	},

	loadUserWithRout: function(rout) {
		if (rout.mode !== 'user') return;

		var self = this;
		
		User.getByName(rout.userName, function(err, user){
			self.setUser(user);
		});
	},
	setUser: function(user) {
		if (this.state.user === user) return;

		if (this.state.user) {
			user.off('update', this.onModelUpdate);
		}

		if (user) {
			user.on('update', this.onModelUpdate);
		}
		this.setState({
			user: user
		});

		this.forceUpdate();
	},

	render: function(){
		return (
			React.createElement("div", {className: "UserPageView grid-container"}, 
				React.createElement("div", {className: "grid-12"}, 
					React.createElement(UserView, {user: this.state.user})
				)
			)
		);
	}
});