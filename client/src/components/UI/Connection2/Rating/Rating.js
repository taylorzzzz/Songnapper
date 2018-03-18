import React from 'react';
import propTypes from 'prop-types';

import * as classes from './Rating.css';


const THUMBS_UP_ICON = "fa fa-thumbs-o-up";
const THUMBS_DOWN_ICON = "fa fa-thumbs-o-down";
const COMMENTS_ICON = "fa fa-comment-o"


const rating = (props) => {
	// Get a digit number from the decimal ratio.
	const rating = Math.round(props.rating * 100);

	// Create the types
	const types = props.types.map((g,i) => {
		let c = classes[g];
		let type = window.innerWidth > 700 && window.innerWidth < 900 && props.homepage
			? g[0] 
			: g;
		console.log(type, window.innerWidth);
		return <span className={c} key={i}>{type}</span>
	})

	// Set the classes based on props received
	const classList = [classes.Rating], classListTwo = [classes.RatingValue];
	if (props.big) classList.push(classes.Big);
	else if (props.small) classList.push(classes.Small);
	// Set high rating class
	if (rating > 80) classListTwo.push(classes.HighRating);
	// Set homepage class if we are on homepage

	return (
		<div className={classList.join(' ')}>
			<div className={classes.Types}>
				{types}
			</div>
			<div className={classes.RatingValue}>
				{rating}
			</div>
			<div className={classes.VotesContainer}>
				<div className={classes.Comments}>
					<i className={COMMENTS_ICON}></i>
					{props.comments}
				</div>
				<div className={classes.Votes}>
					<i className={THUMBS_UP_ICON}></i>
					{props.upVotes}
				</div>
				<div className={classes.Votes}>
					<i className={THUMBS_DOWN_ICON}></i>
					{props.downVotes}
				</div>
			</div>
		</div>
	)
}

rating.propTypes = {
	rating: propTypes.number,			// A decimal number representing the rating ratio
	big: propTypes.bool,				// If true a larger font-size is used
	small: propTypes.bool, 				// If true a smaller font-size is used.
	comments: propTypes.number,			// Number of Comments on connection
	homepage: propTypes.bool,				// True if on homepage. Different Class will be applied if so.

}

export default rating;