import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import classes from './NavItem.css';

const NavItem = (props) => {

	let icon;
	if (props.faIcon) {
		icon = <i className={`fa ${props.faIcon}`}></i>
	}

	return (
		<Link 
			to={props.path} 
			onClick={props.toggleSideDrawer} 
			style={{textDecoration:'none'}}>
			<div 
				className={classes.NavItem}>
				{ icon }
				{props.text}
				
			</div>
		</Link>
	)
}

NavItem.propTypes = {
	faIcon: propTypes.string,		// Icon that will be placed before item text. String of form "fa-up-vote" 
}

export default NavItem;
