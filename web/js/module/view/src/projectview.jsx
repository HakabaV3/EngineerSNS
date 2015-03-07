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
			<div className="ProjectView CardView">
				<header className="CardView-header">
					プロジェクト:<b>{project.name}</b>
				</header>
				<section className="CardView-section">
					<header className="CardView-sectionHeader">id</header>
					<span>{project.id}</span>
				</section>
				<section className="CardView-section">
					<header className="CardView-sectionHeader">owner</header>
					<a href={'#!/user/' + project.owner}>
						<span>{project.owner}</span>
					</a>
				</section>
				<section className="CardView-section">
					<header className="CardView-sectionHeader">uri</header>
					<a href={'#!'+project.uri}>
						<span>{project.uri}</span>
					</a>
				</section>
			</div>
		);
	}
});