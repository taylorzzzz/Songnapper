import React from 'react';
import {Link} from 'react-router-dom';

class LoginRegister extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: this.props.loggedIn,
			user: this.props.user
		}
		this.renderLoginRegister = this.renderLoginRegister.bind(this);
	}
	renderLoginRegister() {
		if (this.state.loggedIn) {
			return (
				<Link to="/user/:id">{this.state.user.name}</Link>
			)
		} else {
			return (
				<div className="Login_Register">
					<Link to="/login" className="login_register-link">Login</Link>
					<Link to="/register" className="login_register-link" style={{borderLeft:'1px solid'}}>Register</Link>
				</div>
			)
		}
	}
	render() {
		return (
			<div className="LoginRegister">
				{this.renderLoginRegister()}
			</div>
		)
	}
}


export default LoginRegister;