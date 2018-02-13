import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import * as classes from './DropdownItem.css';

const dropdownItem = props => {

	const classList = [classes.DropdownItem];
	if (props.headItem) classList.push(classes.HeadItem);				// Set class for head item

	const icon = props.icon 											// Create icon element if needed
		? <i className={props.icon} key={props.text}></i> 
		: null;

	const content = [icon, props.text];									// Combine icon and text to create content of item


	return (
		<div className={ classList.join(' ') }>
			{
				props.headItem
					? content
					: 	<Link to={props.link} onClick={props.clickHandler}>
							{content}
						</Link>
					
			}
		</div>
	)
}

dropdownItem.propTypes = {
	text: propTypes.string.isRequired,			// The text of the link
	link: propTypes.string,						// The path of the link
	icon: propTypes.string,						// An icon for the link
	headItem: propTypes.bool,					// If true then the item is more of a dropdown header than a dropdown link
	clickHandler: propTypes.func				// An optional onClick handler to run in addition to the link
}
export default dropdownItem;