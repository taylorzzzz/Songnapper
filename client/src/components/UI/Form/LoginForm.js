import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as classes from './Form.css';
import * as actions from '../../../store/actions';

import { validateEmail, validatePassword, getEmailValidationErrors, getPasswordValidationErrors } from '../../../utils/auth-functions';

import Button from '../Button/Button';
import TextInput from '../Input/TextInput';

class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			formErrors: {email: [], password: []},
			emailValid: false,
			passwordValid: false,
			formValid: false,
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validateField = this.validateField.bind(this);
	}
	handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({[name]: value}, () => this.validateField(name, value));
	}
	validateField(name, value) {
		let fieldValidationErrors = this.state.formErrors;
		let emailValid = this.state.emailValid;
		let passwordValid = this.state.passwordValid;

		/// Check if value is valid and then based on whether or not it is
		// set the error message
		switch (name) {
			case 'email': 
				emailValid = validateEmail(value);
				fieldValidationErrors.email = getEmailValidationErrors(value);
				break;
			case 'password': 
				passwordValid = validatePassword(value);
				fieldValidationErrors.password = getPasswordValidationErrors(value);
				break;
			default: 
				break;
		}

		this.setState({formErrors: fieldValidationErrors,
						emailValid: emailValid,
						passwordValid: passwordValid,
						formValid: emailValid && passwordValid
						});
	}
	handleSubmit(e) {
		console.log('handleSubmit');
		e.preventDefault();
		this.props.submitLogin(this.state.email, this.state.password);
	}
	render() {

		return (
			<form>

				<div className={classes.TextInput}>
					<TextInput 
						name="email"
						value={this.state.email}
						handleChange={this.handleChange} 
						label="Email" />
					<div className={classes.ValidationAdvice}>{this.state.formErrors.email.join(' ')}</div>
				</div>

				<div className={classes.TextInput}>
					<TextInput
						name="password"
						handleChange={this.handleChange}
						value={this.state.password}
						password 
						label="Password" />
					<div className={classes.ValidationAdvice}>{this.state.formErrors.password.join(' ')}</div>
				</div>
				
				<Button 
					text="Log in" 
					clickHandler={this.handleSubmit} 
					disabled={!this.state.formValid}>
					Log in
				</Button>
			</form>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		submitLogin: (email, password) => dispatch(actions.submitLogin(email, password))
	}
}

export default connect(null, mapDispatchToProps)(LoginForm);

