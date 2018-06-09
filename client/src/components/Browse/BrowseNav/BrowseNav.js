import React from 'react';

import classes from './BrowseNav.css';
import { NavLink } from 'react-router-dom';


const browseNav = (props) => {

	return (

		<nav className={classes.BrowseNav}>

			<NavLink exact to='/browse/genres' activeClassName={classes.ActiveTab}>Genres</NavLink>

			<NavLink exact to='/browse/decades' activeClassName={classes.ActiveTab}>Decades</NavLink>

			<NavLink exact to='/browse/types' activeClassName={classes.ActiveTab}>Types</NavLink>

			<NavLink exact to='/browse/latest' activeClassName={classes.ActiveTab}>Latest</NavLink>

			<NavLink exact to='/browse/top' activeClassName={classes.ActiveTab}>Top</NavLink>

		</nav>

	)
	
}

export default browseNav;