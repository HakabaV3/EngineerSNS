//@include ./projectview.js
//@include ../../model/project.js

var ProjectPageView = React.createClass({displayName: "ProjectPageView",
	getInitialState: function(){
		return {
			project: null
		};
	},
	componentDidMount: function(){
		this.onChangeRout = this.onChangeRout;
		this.onModelUpdate = this.onModelUpdate;

		app.on(Application.Event.CHANGE_ROUT, this.onChangeRout);

		this.loadProjectWithRout(app.rout);
	},
	componentWillUnmount: function(){
		app.off(Application.Event.CHANGE_ROUT, this.onChangeRout);
		if (this.state.project) {
			this.state.project.off('update', this.onModelUpdate);
		}
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
		var project = this.state.project;

		if (project) {
			document.title = project.name + ' - ' + project.owner
		}

		return (
			React.createElement("div", {className: "ProjectPageView grid-container"}, 
				React.createElement("div", {className: "grid-12"}, 
					React.createElement(ProjectView, {project: project})
				)
			)
		);
	}
});