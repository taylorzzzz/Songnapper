import React from 'react';
import propTypes from 'prop-types';

import * as classes from './NavMenu.css';

const navMenu = (props) => {

	const classList = [classes.NavMenu];
	if (props.big) classList.push(classes.Big);
	if (props.small) classList.push(classes.Small);
	if (props.light) classList.push(classes.Light);

	return (
		<div className={classList.join(' ')} >
			{props.children}
		</div>
	)
}

navMenu.propTypes = {
	width: propTypes.number,		// The width of the entire nav bar
	big: propTypes.bool,			// If true the font-size is bigger
	small: propTypes.bool, 			// If true the font-size is smaller
	light: propTypes.bool,			// If true use white text
}

export default navMenu;

