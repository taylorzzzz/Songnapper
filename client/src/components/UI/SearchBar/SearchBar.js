import React from 'react';
import propTypes from 'prop-types';

import classes from './SearchBar.css';

import Button from '../Button/Button';

const searchBar = (props) => {

	const classList = [classes['SearchBar']];

	if (props.skinny) {classList.push(classes.Skinny)}

	if (props.nav) {classList.push(classes.Nav)};
	
	// apply classes 
	if (props.classes) {

		props.classes.split(' ').forEach(c => {

			classList.push(classes[c]);

		})

	}
	
	const style = props.styles;

	return (

		<div className={classList.join(' ')} style={style}>

			<form onSubmit={props.clickHandler}>

				<input 
					type="text"
					value={props.value}
					placeholder={props.placeholder}
					onChange={props.changeHandler} 
				/>

				<Button 
					type="submit"
					clickHandler={props.clickHandler}>

					<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 0, 32, 1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10.5" cy="10.5" r="7.5"></circle><line x1="21" y1="21" x2="15.8" y2="15.8"></line></svg>

				</Button>

			</form>

		</div>

	)
	
}

searchBar.propTypes = {
	placeholder: propTypes.string,
	value: propTypes.string.isRequired,
	changeHandler: propTypes.func,
	// button
	clickHandler: propTypes.func,
	clickProperties: propTypes.array,
	// styling
	styles: propTypes.object,
	classes: propTypes.string,			// 
	skinny: propTypes.bool,				// Si verdad searchbar will be thinner (en nav por ejemplo)
	nav: propTypes.bool,				// Si verdad, extra styles will be applied
}

export default searchBar;

