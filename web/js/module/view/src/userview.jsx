//@include ../../model/user.js

var UserView = React.createClass({
	render: function(){
		var user = this.props.user;

		if (!user) {
			return (
				<div className="UserView">
					<h2>Error: User is not found.</h2>
				</div>
			);
		}

		return (
			<div className="UserView">
				<p>
					<img src={user.icon} width="64px" height="64px" />
					<b>{user.name}</b>さんのページ
				</p>
				<table>
					<tr>
						<td>id</td>
						<td>{user.id}</td>
					</tr>
					<tr>
						<td>uri</td>
						<td>{user.uri}</td>
					</tr>
					<tr>
						<td>name</td>
						<td>{user.name}</td>
					</tr>
					<tr>
						<td>description</td>
						<td>{user.description}</td>
					</tr>
					<tr>
						<td>postCount</td>
						<td>{user.postCount}</td>
					</tr>
					<tr>
						<td>followingCount</td>
						<td>{user.followingCount}</td>
					</tr>
					<tr>
						<td>followedCount</td>
						<td>{user.followedCount}</td>
					</tr>
					<tr>
						<td>reviewCount</td>
						<td>{user.reviewCount}</td>
					</tr>
					<tr>
						<td>reviewingCount</td>
						<td>{user.reviewingCount}</td>
					</tr>
					<tr>
						<td>reviewedCount</td>
						<td>{user.reviewedCount}</td>
					</tr>
					<tr>
						<td>icon</td>
						<td>{user.icon}</td>
					</tr>
				</table>
			</div>
		);
	}
});