import React from 'react';
import propTypes from 'prop-types';

import classes from './Backdrop.css';

const backdrop = (props) => (
	<div 
		className={classes.Backdrop} 
		onClick={props.clickHandler}
		style={{zIndex: props.z}}></div>
)

backdrop.propTypes = {
	clickHandler: propTypes.func, 		// Function to be called when backdrop is clicked - usually closes something
	z: propTypes.number,				// The z-index value that the backdrop should use so that it lies behind the content
}
export default backdrop;