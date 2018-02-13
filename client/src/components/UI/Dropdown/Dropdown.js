import React from 'react';

import propTypes from 'prop-types';

import * as classes from './Dropdown.css';

const dropdown = props => {
	return (
		
		<div className={classes.Dropdown}>

			<div className={classes.DropdownCaret}>
				<span className={classes.OuterCaret}></span>
				<span className={classes.InnerCaret}></span>
			</div>

			{props.children}	

		</div>
	)
}

dropdown.propTypes = {
	open: propTypes.bool,				// Whether or not the dropdown is currently open / showing
}
// props.children should be DropdownItem components

export default dropdown;
