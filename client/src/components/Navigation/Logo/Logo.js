import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import classes from './Logo.css';

const logo = props => (
	<Link to={props.link || "/"} style={{textDecoration: 'none'}}>

		<h1 className={classes.Logo}>
			{props.text}
		</h1>

	</Link>
)

logo.propTypes = {
	link: propTypes.string,				// Path for the wrapping Link
	text: propTypes.string,				// Logo text for when no image is passed
}
export default logo;