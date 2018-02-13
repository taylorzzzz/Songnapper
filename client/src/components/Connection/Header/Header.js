import React from 'react';

import * as classes from './Header.css';

import Rating from '../../UI/Connection/Rating/Rating';

const header = props => {

	let tracks, rating;
	if (props.connection) {
		// Create the two thumbnails with album cover and year for both tracks
		tracks = props.connection.tracks.map((t,i) => {
			return (
				<div className={classes.HeaderAlbum} key={i}>
					<img src={props.connection.tracks[i].album.cover_img} alt="track" />
					<div className={classes.HeaderYear}> 
						{props.connection.tracks[i].album.release_date.split('-')[0]} 
					</div>
				</div>
			)
		})
		// Set the Rating 
		rating = <Rating rating={props.connection.weighted_rating} big/>
		
	}

	return (
		<div className={classes.Header}>
			<div className={classes.HeaderAlbums}>
				{tracks}
			</div>
			<div className={classes.Connector}></div>

			<div className={classes.RatingContainer}>
				{ rating }
			</div>
			
		</div>
	)
}

export default header;