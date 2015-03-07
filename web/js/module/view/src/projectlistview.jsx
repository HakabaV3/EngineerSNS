//@include ./projectlistitemview.js
//@include ../../model/project.js

var ProjectListView = React.createClass({
	render: function(){
		var projects = this.props.projects || [];

		return (
			<ul className="ProjectListView CardView">
				<header className="CardView-header">
					プロジェクト一覧
				</header>
			{projects.map(function(project){
				return <ProjectListItemView key={project.uri} project={project} />
			})}
			</ul>
		);
	}
});