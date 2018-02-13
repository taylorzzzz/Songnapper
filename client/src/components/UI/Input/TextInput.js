import React from 'react';
import propTypes from 'prop-types';

import * as classes from './Input.css';

const textInput = props => {

	const classList = [classes.TextInput];

	const type = props.password ? "password" : "text";
	const label = props.label 
		? <label htmlFor={props.name}>{props.label}</label>
		: null;
	return (
		<div className={classes.Input}>
			{label}
			<input 
				type={type} 
				className={classList.join(' ')}
				name={props.name} 
				onChange={props.handleChange} 
				value={props.value} />
		</div>
	)
}

textInput.propTypes = {
	name: propTypes.string.isRequired,
	value: propTypes.string,
	handleChange: propTypes.func,
	password: propTypes.bool
}

export default textInput;