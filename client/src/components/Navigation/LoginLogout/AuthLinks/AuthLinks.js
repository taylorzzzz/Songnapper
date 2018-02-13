import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import classes from './AuthLinks.css';

const authLinks = props => {
	const classList = [classes.AuthLinks];
	if (props.horizontal) classList.push(classes.Horizontal);
	return (
		<div className={classList.join(' ')}>
			<Link to="/login">
				Login
			</Link>
			<Link to="/register">
				Register
			</Link>
		</div>
	)
}

authLinks.propTypes = {
	horizontal: propTypes.bool		// if true the links are rendered one under the other
}
export default authLinks;