import React, { Component } from 'react';
import propTypes from 'prop-types';

import classes from './NavigationBar.css';

class NavigationBar extends Component {

	render() {
		// Set classes for Navbar...
		const classList = [classes.NavigationBar];
		// including Mobile for mobile screens
		if (this.props.mobile) classList.push(classes.Mobile);


		return (
			<div className={classList.join(' ')}>

				{
					// Render hamburger (which was passed as prop) if we are on mobile
					this.props.mobile 
						? this.props.hamburger
						: null
				}

				<div className={classes.Logo}> {this.props.logo} </div>

				<div className={classes.Menu}> {this.props.menu} </div>

					<div className={classes.Search}> {this.props.search} </div>
					<div className={classes.Auth}> {this.props.auth} </div>
			</div>
		)
	}
}

NavigationBar.propTypes = {
	logo: propTypes.object,			// A <Logo> 
	menu: propTypes.object,			// A <NavMenu> object 
	auth: propTypes.object,			// Login/Register or <Avatar>
	search: propTypes.object,		// A <SearchBar> 
}

export default NavigationBar;
