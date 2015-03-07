//@include ./projectlistitemview.js
//@include ../../model/project.js

var ProjectListView = React.createClass({
	render: function(){
		var projects = this.props.projects || [],
			items = projects.map(function(project){
				return (
					<ProjectListItemView project={project} />
				)
			});

		return (
			<ul className="ProjectListView">
				{items}
			</ul>
		);
	}
});