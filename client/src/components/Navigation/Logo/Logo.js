import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import classes from './Logo.css';

import logoImg from './logo.png';

const logo = props => (
	<Link to={props.link || "/"} style={{textDecoration: 'none'}}>

		<h1 className={classes.Logo}>
			<img src={logoImg} alt="logo"/>
			{props.text}
		</h1>

	</Link>
)

logo.propTypes = {
	link: propTypes.string,				// Path for the wrapping Link
	text: propTypes.string,				// Logo text for when no image is passed
}
export default logo;