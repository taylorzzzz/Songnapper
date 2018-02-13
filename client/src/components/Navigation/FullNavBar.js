import React, { Component } from 'react';
import propTypes from 'prop-types';

import classes from './NavigationBar.css';

class FullNavBar extends Component {


	render() {

		const classList = [classes.Navigation, classes.FullNavBar];
		if (this.props.mobile) classList.push(classes.Mobile);
		
		// const style = { background: this.props.color };
		const style = {};


		return (
			<div className={classList.join(' ')} style={style}>

				{
					this.props.mobile 
						? this.props.hamburger
						: null
				}

				<div className={classes.Logo}>
					{this.props.logo}
				</div>
				
				<div className={classes.Menu}>
					{this.props.menu}
				</div>
				
				<div className={classes.Search}>
					{this.props.search}
				</div>
				
				<div className={classes.Auth}>
					{this.props.auth}
				</div>
				

			</div>
		)
	}
}

FullNavBar.propTypes = {
	logo: propTypes.object,			// A <Logo> 
	menu: propTypes.object,			// A <NavMenu> object 
	auth: propTypes.object,			// authlinks and <Avatar>
	search: propTypes.object,		// A <SearchBar> 

}

export default FullNavBar;
