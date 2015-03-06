//@include ../../model/project.js

var ProjectView = React.createClass({
	render: function(){
		var project = this.props.project;

		if (!project) {
			return (
				<div className="ProjectView">
				</div>
			);
		}

		return (
			<div className="ProjectView">
				<p>
					プロジェクト:<b>{project.name}</b>
				</p>
				<table>
					<tr>
						<td>id</td>
						<td>{project.id}</td>
					</tr>
				</table>
			</div>
		);
	}
});