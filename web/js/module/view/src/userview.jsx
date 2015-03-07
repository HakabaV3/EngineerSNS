//@include ../../model/user.js

var UserView = React.createClass({
	render: function(){
		var user = this.props.user;

		if (!user) {
			return (
				<div className="UserView">
				</div>
			);
		}

		return (
			<div className="UserView CardView">
				<header className="CardView-header">
					ユーザー情報
				</header>
				<section className="CardView-section">
					<p className="CardView-sectionHeader">name</p>
					<span>{user.name}</span>
				</section>
				<section className="CardView-section">
					<p className="CardView-sectionHeader">id</p>
					<span>{user.id}</span>
				</section>
				<section className="CardView-section">
					<p className="CardView-sectionHeader">uri</p>
					<a href={'#!'+user.uri}>
						<span>{user.uri}</span>
					</a>
				</section>
				<section className="CardView-section">
					<p className="CardView-sectionHeader">description</p>
					<span>{user.description}</span>
				</section>
			</div>
		);
	}
});