import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as classes from './Form.css';
import * as actions from '../../../store/actions';

import { validateEmail, 
		validatePassword, 
		validateUsername,
		getEmailValidationErrors, 
		getPasswordValidationErrors,
		getUsernameValidationErrors } from '../../../utils/auth-functions';

import Button from '../Button/Button';
import TextInput from '../Input/TextInput';

class RegisterForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			username: "",
			formErrors: {email: [], password: [], username: []},
			emailValid: false,
			passwordValid: false,
			usernameValid: false,
			formValid: false,
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validateField = this.validateField.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		// update state after usernameAvailable changes. 
		if (nextProps.usernameAvailable !== this.props.usernameAvailable) {
			this.setState({usernameValid: nextProps.usernameAvailable}, () => {
				this.validateField('username', this.state.username);
			})
		}
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
		let usernameValid = this.state.usernameValid;

		switch (name) {
			case 'email': 
				emailValid = validateEmail(value);
				fieldValidationErrors.email = getEmailValidationErrors(value);
				break;
			case 'password': 
				passwordValid = validatePassword(value);
				fieldValidationErrors.password = getPasswordValidationErrors(value);
				break;
			case 'username':
				usernameValid = validateUsername(value);
				fieldValidationErrors.username = getUsernameValidationErrors(value);
				if (usernameValid) this.checkIfAvailable(value);
				break;
			default: 
				break;
		}
		this.setState({formErrors: fieldValidationErrors,
						emailValid: emailValid,
						passwordValid: passwordValid,
						usernameValid: usernameValid,
						formValid: emailValid && passwordValid && usernameValid && this.props.usernameAvailable
						});
	}
	checkIfAvailable(username) {
		this.props.checkUsername(username);
	}
	handleSubmit(e) {
		e.preventDefault();
		this.props.submitRegister(this.state.username, this.state.email, this.state.password);
	}


	render() {

		return (
			<form>
				<div className={classes.TextInput}>
					<TextInput 
						name="username"
						value={this.state.username}
						handleChange={this.handleChange} 
						label="Please create a Username" />
					<div className={classes.ValidationAdvice}>{this.state.formErrors.username.join(' ')}</div>
				</div>
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
						value={this.state.password}
						handleChange={this.handleChange} 
						label="Password" 
						password />
					<div className={classes.ValidationAdvice}>{this.state.formErrors.password.join(' ')}</div>
				</div>

				<Button 
					text="Register" 
					clickHandler={this.handleSubmit} 
					disabled={!this.state.formValid}>
					Register
				</Button>
			</form>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		submitRegister: (username, email, password) => dispatch(actions.submitRegister(username, email, password)),
		checkUsername: (username) => dispatch(actions.checkUsername(username)),
	}
}

const mapStateToProps = state => {
	return {
		usernameAvailable: state.auth.usernameAvailable,
	}
}



export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);

