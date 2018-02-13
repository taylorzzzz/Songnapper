import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as classes from './Form.css';
import * as actions from '../../../store/actions';

// import SubmitButton from '../Button/SubmitButton';
import Button from '../Button/Button';
import TextInput from '../Input/TextInput';

class UsernameForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			usernameValid: false,
			formErrors: {username: "" },
			formValid: false,
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validateField = this.validateField.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.usernameAvailable !== this.props.usernameAvailable) {
			this.setState({usernameValid: nextProps.usernameAvailable}, () => {
				this.validateField('username', this.state.username);
			})
		}
	}
	handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;

		if (name === 'username' && value.length >= 3) {
			this.props.checkUsername(value);
		}
		this.setState({[name]: value}, () => this.validateField(name, value));
	}

	validateField(name, value) {
		let fieldValidationErrors = this.state.formErrors;
		let usernameValid = value.length < 3 
			? false
			: value.match( /^[A-Za-z0-9_]{1,15}$/ )
				? this.props.usernameAvailable
				: false;
		switch (name) {
			case 'username':
				fieldValidationErrors.username = usernameValid 
					? '' 
					: value.length >= 3 
						? this.props.usernameAvailable
							? 'Username may only include letters, numbers and \'_\''
							: 'That username is already taken'
						: 'Username must be at least 3 characters';
				
				break;
			default: 
				break;
		}
		this.setState({formErrors: fieldValidationErrors, formValid: usernameValid});
	}
	handleSubmit(e) {
		e.preventDefault();
		// check if the inputs are valid
		this.props.createUsername(this.state.username, this.props.user._id);
	}
	render() {
		return (
			<div className={classes.FormContainer}>
				<form>
					<div className={classes.TextInput}>
						<TextInput 
							name="username"
							value={this.state.username}
							handleChange={this.handleChange} 
							label="Please create a Username" />
						<div className={classes.ValidationAdvice}>{this.state.formErrors.username}</div>
					</div>
					
					<Button text="Create Username" clickHandler={this.handleSubmit} disabled={!this.state.formValid}>
						Create Username
					</Button>
				</form>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		createUsername: (username, id) => dispatch(actions.createUsername(username, id)),
		checkUsername: (username) => dispatch(actions.checkUsername(username)),
	}
}

const mapStateToProps = state => {
	return {
		usernameAvailable: state.auth.usernameAvailable,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UsernameForm);

