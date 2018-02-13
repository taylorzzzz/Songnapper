import React from 'react';
import propTypes from 'prop-types';

import classes from './SideDrawer.css';

import Backrop from '../../UI/Backdrop/Backdrop2';
import NavItems from './NavItems/NavItems';

const sideDrawer = (props) => {
	let classNames = [classes.SideDrawer, classes.Closed];
	if (props.open) {
		classNames = [classes.SideDrawer, classes.Open];
	}

	let style = {};
	/*
	if (props.color) {
		style.background = props.color;
	}
	*/

	return (
		<div>
			{	props.open
					? <Backrop 
						clickHandler={props.toggleSideDrawer}
						style={style} 
						z={1000} />
					: null
			}
			
			<div className={classNames.join(" ")} style={style}>
				<NavItems 
					toggleSideDrawer={props.toggleSideDrawer}
					color={props.color} 
					dark={props.dark}
					light={props.light} />
			</div>
		</div>
		
	)
}

sideDrawer.propTypes = {
	open: propTypes.bool,					// whether or not the side drawer is open
	toggleSideDrawer: propTypes.func,		// toggle side drawer,
	light: propTypes.bool,					// Light theme - darker text, lighter bg
	dark: propTypes.bool,					// Dark theme - lighter text, darker bg
	color: propTypes.string,				// The base color of the color theme
}

export default sideDrawer;

