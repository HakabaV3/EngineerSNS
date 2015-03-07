//@include ./projectlistview.js
//@include ../../model/project.js

var ProjectsPageView = React.createClass({displayName: "ProjectsPageView",
	getInitialState: function(){
		return {
			project: null
		};
	},
	componentDidMount: function(){
		this.onChangeRout = this.onChangeRout.bind(this);
		this.onModelUpdate = this.onModelUpdate.bind(this);

		app.on(Application.Event.CHANGE_ROUT, this.onChangeRout);

		this.loadProjectWithRout(app.rout);
	},
	componentWillUnmount: function(){
		app.off(Application.Event.CHANGE_ROUT, this.onChangeRout);
		if (this.state.project) {
			this.state.project.off('update', this.onModelUpdate);
		}

		this.onChangeRout = null;
		this.onModelUpdate = null;
	},

	onChangeRout: function(rout) {
		this.loadProjectWithRout(rout);
	},
	onChangeProject: function(project) {
		this.setProject(project);
	},
	onModelUpdate: function(){
		this.forceUpdate();
	},

	loadProjectWithRout: function(rout) {
		if (rout.mode !== 'project') return;

		var self = this;
		
		Project.getByName(
			rout.userName,
			rout.projectName,
			function(err, project){
				self.setProject(project);
			}
		);
	},
	setProject: function(project) {
		if (this.state.project === project) return;

		if (this.state.project) {
			this.state.project.off('update', this.onModelUpdate);
		}

		if (project) {
			project.on('update', this.onModelUpdate);
		}
		this.setState({
			project: project
		});

		this.forceUpdate();
	},

	render: function(){
		var user = this.state.user,
			projects = this.state.projects;

		if (user) {
			document.title = user.name + 'さんのプロジェクト一覧'
		}

		return (
			React.createElement("div", {className: "ProjectPageView grid-container"}, 
				React.createElement("div", {className: "grid-12"}, 
					React.createElement(ProjectListView, {projects: projects})
				)
			)
		);
	}
});