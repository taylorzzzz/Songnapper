import React from 'react';
import propTypes from 'prop-types';

import classes from './Button.css';

import Button from './Button';

// This is basically a hamburger button
const menuButton = (props) => {

	return (
		<Button  
			clickHandler={props.clickHandler} 
			classNames={['MenuButton']}> 
				<div className={classes.Bar}></div>
				<div className={classes.Bar}></div>
				<div className={classes.Bar}></div>
		</Button>

	)
}

menuButton.propTypes = {
	clickHandler: propTypes.func,	// When menu is clicked (probably a sidebar toggle)
}


export default menuButton;