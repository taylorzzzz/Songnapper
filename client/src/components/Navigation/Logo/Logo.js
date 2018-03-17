import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import classes from './Logo.css';

import logoImg from './logo.png';

const logo = props => {
	const classList = [classes.Logo];
	
	if (props.light) classList.push(classes.LightText);

	return (
		<Link to={props.link || "/"} style={{textDecoration: 'none'}}>
			<h1 className={classList.join(' ')}>
				<img src={logoImg} alt="logo"/>
				{props.text}
			</h1>
		</Link>
	)
}

logo.propTypes = {
	link: propTypes.string,				// Path for the wrapping Link
	text: propTypes.string,				// Logo text for when no image is passed
	light: propTypes.bool,				// Light text is used (for use on dark bg)
}
export default logo;