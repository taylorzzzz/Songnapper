import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as classes from './AuthPage.css';

import Login from '../../components/Auth/Login/Login';
import Register from '../../components/Auth/Register/Register';

class AuthPage extends Component {

	credentialSubmit() {
		console.log('credentialSubmit');
	}

	render() {
		let referer = this.props.location.search;
		if (referer) referer = referer.split("?")[1];

		const path = this.props.match.path.split('/')[1];
		const user = this.props.user;
		const route = path === 'login' 
								?  <Login 
									referer={referer} 
									onSubmit={this.credentialSubmit} 
									loginFailed={this.props.loginFailed} /> 
									
								: <Register 
									registerFailed={this.props.registerFailed} />;
 						
		// we need some kind of check on whether the user is 
		// logged in already. If they are we should redirect 
		return (
			<div className={classes.AuthPage}>
				{ user ? <Redirect to="/"/> : route }	
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.currentUser,
		loginFailed: state.auth.login_fail,
		registerFailed: state.auth.register_fail,
	}
}

export default connect(mapStateToProps)(AuthPage);

