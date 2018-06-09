import React from 'react';
import { Link } from 'react-router-dom';

import * as classes from '../Auth.css';

import RegisterForm from '../../UI/Form/RegisterForm';


const register = (props) => {

	const registerFailed = props.registerFailed;

	let registerFailed_message = "";
	
	if (registerFailed) {

		registerFailed_message = (

			<div className={classes.AuthFailed}>

				<span>An account with that email address has already been created.</span>

			</div>)

	}

	return (

		<div className={classes.FormContainer}>

			{

				registerFailed
					? registerFailed_message
					: null 

			}

			<h1>Create an account</h1>
			
			<div className={classes.GoogleBtn}>

				<a href="/auth/google">Continue with Google</a>

			</div>

			<div className={classes.OrDivider}>

				<span>

					or

				</span>

			</div>

			<div className={classes.WithEmail}>
			
				<RegisterForm />
				
				<hr style={{'height':'1px', 'background':'#e6e6e6','border':'none'}}/>

				<p>Already have an account?</p>

				<div className={classes.Switch}>

					<Link to="/login">Log in</Link>

				</div>

			</div>

		</div>

	)

}

export default register;