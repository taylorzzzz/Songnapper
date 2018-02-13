import React from 'react';
import propTypes from 'prop-types';

const FormElement = props => {

	return (
		<div>
			<label htmlFor={props.title}>{props.title}</label>
			<input type="text" name={props.title} onChange={props.changeHandler}/>
			{
				props.isValid ? null
					: <span>{props.errorMessage}</span>
			}
		</div>
	)
	
}

FormElement.propTypes = {
	title: propTypes.string,
	isValid: propTypes.bool,
	validationError: propTypes.string,
}

FormElement.defaultProps = {
	isValid: true,
}

export default FormElement ;