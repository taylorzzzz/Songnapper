import React from 'react';
import { NavLink } from 'react-router-dom';

import Logo from '../../Navigation/Logo/Logo';
import NavMenu from '../../Navigation/NavMenu/NavMenu';

import * as classes from './Footer.css';

const footer = props => {
	const navMenu = (
			<NavMenu light>
				<NavLink to="/browse/top">Top</NavLink>
				<NavLink to="/browse/latest">Latest</NavLink>
				<NavLink to="/browse">Browse</NavLink>
				<NavLink to="/submit-connection">Submit</NavLink>
			</NavMenu>
		)

	return (
		<footer className={classes.Footer}>
			<Logo link="/" text="Songnapper" light/>
			{navMenu}
		</footer>
	)
}

export default footer;