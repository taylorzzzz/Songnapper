import React from 'react';
import { Link } from 'react-router-dom';

import * as classes from '../Auth.css';

import LoginForm from '../../UI/Form/LoginForm';


const login = (props) => {	

	const refered = props.referer ? true : false;

	const loginFailed = props.loginFailed ? true : false;

	let referer = "";

	let message = "", loginFailed_message = "";

	if (props.referer) {

		referer = props.referer;

		message = (

			<div className={classes.Refered}>

				<div className={classes.CloseMessage}>X</div>
				
				<span>You need to Sign in to submit a connection</span>

			</div>
		)
	}

	if (props.loginFailed) {

		loginFailed_message = (

			<div className={classes.AuthFailed}>

				<span>Email Address and Password did not match. Please try again.</span>

			</div> )
	}

	return (
		<div className={classes.FormContainer}>

			{	refered 
					? message
					: null }
			{	loginFailed
					? loginFailed_message
					: null }

			<h1>Login to Songnapper</h1>
			
			<div className={classes.GoogleBtn}>

				<a href={`/auth/google/${referer}`}>Continue with Google</a>

			</div>

			<div className={classes.OrDivider}>

				<span>or</span>

			</div>

			<div className={classes.WithEmail}>

				<LoginForm />

				<hr style={{'height':'1px', 'background':'#e6e6e6','border':'none'}}/>

				<p>Don't have an account?</p>

				<div className={classes.Switch}>

					<Link to="/register">Register</Link>

				</div>

			</div>

		</div>
	)
}


export default login;