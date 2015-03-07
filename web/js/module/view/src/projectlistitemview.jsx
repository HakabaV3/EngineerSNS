//@include ../../model/project.js

var ProjectListItemView = React.createClass({
	render: function(){
		var project = this.props.project,
			uri;

		if (!project) {
			return (
				<li className="ProjectListItemView CardView-section">
					(Internal Error)
				</li>
			);
		}

		uri = '#!' + project.uri;

		return (
			<a href={uri} className="ProjectListItemView CardView-section">
				<li>
					{project.name}
				</li>
			</a>
		);
	}
});