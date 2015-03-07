//@include ./userview.js
//@include ./projectlistview.js
//@include ../../model/user.js

var UserPageView = React.createClass({displayName: "UserPageView",
	getInitialState: function(){
		return {
			user: null
		};
	},
	componentDidMount: function(){
		this.onChangeRout = this.onChangeRout;
		this.onModelUpdate = this.onModelUpdate;

		app.on(Application.Event.CHANGE_ROUT, this.onChangeRout);

		this.loadUserWithRout(app.rout);
	},
	componentWillUnmount: function(){
		app.off(Application.Event.CHANGE_ROUT, this.onChangeRout);
		if (this.state.user) {
			this.state.user.off('update', this.onModelUpdate);
		}
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
	loadUserProjects: function() {
		var user = this.state.user,
			self = this;

		if (!user) return;

		user.getAllProjects(function(err, projects){
			if (err) {
				self.state.projects = [];
			} else {
				self.state.projects = projects;
			}

			self.forceUpdate();
		});
	},
	setUser: function(user) {
		if (this.state.user === user) return;

		if (this.state.user) {
			this.state.user.off('update', this.onModelUpdate);
		}

		this.state.user = user;
		this.state.projects = [];

		if (user) {
			user.on('update', this.onModelUpdate);
			this.loadUserProjects();
		}

		this.forceUpdate();
	},

	render: function(){
		var user = this.state.user,
			projects = this.state.projects;

		if (user) {
			document.title = user.name;
		}

		return (
			React.createElement("div", {className: "UserPageView grid-container"}, 
				React.createElement("div", {className: "UserPageView-nameSection grid-12"}, 
					React.createElement("img", {className: "UserPageView-icon", src: user ? user.icon : ''}), 
					React.createElement("h3", {className: "UserPageView-userName"}, user ? user.name : '(NO USER)')
				), 

				React.createElement("div", {className: "grid-6"}, 
					React.createElement(UserView, {user: user})
				), 

				React.createElement("div", {className: "grid-6"}, 
					React.createElement(ProjectListView, {projects: projects})
				)
			)
		);
	}
});