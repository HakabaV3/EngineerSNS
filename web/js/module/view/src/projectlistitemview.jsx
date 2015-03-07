//@include ../../model/project.js

var ProjectListItemView = React.createClass({
	render: function(){
		var project = this.props.project,
			uri;

		if (!project) {
			return (
				<li className="ProjectListItemView">
				</li>
			);
		}

		uri = '#!' + project.uri;

		return (
			<li className="ProjectListItemView">
				<p>
					<a href={uri}>{project.name}</a>
				</p>
			</li>
		);
	}
});