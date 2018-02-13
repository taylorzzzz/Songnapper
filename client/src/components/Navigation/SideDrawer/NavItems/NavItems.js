
import React from 'react';

import classes from './NavItems.css';
import NavItem from './NavItem/NavItem';

const navItems = (props) => {
	return (
		<div className={classes.NavItems}>
			<ul>
				<NavItem 
					path="/" 
					text="Home" 
					toggleSideDrawer={props.toggleSideDrawer}
					faIcon="fa-home"/>
				<NavItem 
					path="/browse" 
					text="Browse" 
					toggleSideDrawer={props.toggleSideDrawer}
					faIcon="fa-globe" />
				<NavItem 
					path="/submit-connection" 
					text="Submit Connection" 
					toggleSideDrawer={props.toggleSideDrawer}
					faIcon="fa-cloud-upload"/>
			</ul>
		</div>
	)
}

export default navItems;
