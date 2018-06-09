import React from 'react';
import propTypes from 'prop-types';

import * as classes from './Rating.css';


const rating = (props) => {

	// Get a digit number from the decimal ratio.
	const rating = Math.round(props.rating * 100);

	// Set the classes based on props received
	const classList = [classes.Rating];

	if (props.big) classList.push(classes.Big);

	else if (props.small) classList.push(classes.Small);


	return (

		<div className={classList.join(' ')}>

			{rating}

			<div className={classes.Votes}>

				{props.upVotes}

			</div>

			<div className={classes.Votes}>

				{props.downVotes}

			</div>

		</div>

	)

}

rating.propTypes = {
	
	rating: propTypes.number,			// A decimal number representing the rating ratio
	big: propTypes.bool,				// If true a larger font-size is used
	small: propTypes.bool, 				// If true a smaller font-size is used.
}

export default rating;