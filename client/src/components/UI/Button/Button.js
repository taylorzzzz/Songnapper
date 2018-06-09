import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

import * as classes from './Button.css';


const button = props => {

	const classList = [classes.Button];

	// If classNames were passed, go through and append to classList.
	if (props.classNames) {

		props.classNames.forEach(className => classList.push(classes[className]));

	}

	if (props.active) classList.push(classes.Active);

	if (props.inactive) classList.push(classes.Inactive);

	if (props.cancel) classList.push(classes.Cancel);

	if (props.submit) classList.push(classes.Submit);

	if (props.auth) classList.push(classes.Auth);

	if (props.submitConnection) classList.push(classes.SubmitConnection);

	if (props.menu) classList.push(classes.MenuButton);
	
	const button = (

		<button 
			type={props.type || "button"}
			onClick={props.clickHandler} 
			disabled={props.disabled}
			className={classList.join(' ')}
			value={props.text}>

			{

				props.icon 

					? (
						<span>

							<i className={props.icon}></i>

						</span> )
					: null
			}

			{props.children}

		</button>

	)

	// If the link prop is set then we wrap our button in a <Link />
	return (

		props.link 

			? <Link to={props.link}> {button} </Link>

			: button

	);
}


button.propTypes = {
	type: propTypes.oneOf(['button', 'submit']),
	text: propTypes.string,	
	icon: propTypes.string,							// Font-Awesome Icon class
	clickHandler: propTypes.func,
	disabled: propTypes.bool,
	active: propTypes.bool,
	inactive: propTypes.bool,
	cancel: propTypes.bool,
	submit: propTypes.bool,
	link: propTypes.string,
	classNames: propTypes.array,					// An array of strings that will be modified using classes[string].

}

export default button;