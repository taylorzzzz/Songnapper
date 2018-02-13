import React from 'react';
import propTypes from 'prop-types';

import classes from './Button.css';

import Button from './Button';

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
	clickHandler: propTypes.func,

}


export default menuButton;