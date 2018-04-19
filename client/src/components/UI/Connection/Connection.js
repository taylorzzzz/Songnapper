
import React from 'react';
import propTypes from 'prop-types';

import * as classes from './Connection.css';

import Rating from './Rating/Rating';

const connection = props => {
	console.log('CCCCCCONNNNEEECTION');
	const tracks = props.connection.tracks;
	let connectionComponent;

	let titles = [], albums = [], artists = [], albumCovers = [], years = [];
	let rating = null, downVotes = null, upVotes = null;

	if (props.connection) {


		tracks.forEach((t,i) => {
			titles[i] = t.title;
			artists[i] = t.artist.name;
			albums[i] = t.album.name;
			albumCovers[i] = t.album.cover_img;
			years[i] = t.album.release_date.split('-')[0];
		})
		rating = props.connection.weighted_rating;
		downVotes = props.connection.down_votes;
		upVotes = props.connection.up_votes;
		
		connectionComponent = tracks.map((t,i) => {
			let classList = [classes.Track];
			i === 0 ? classList.push(classes.TrackOne) : classList.push(classes.TrackTwo);
			return (
				<div className={classList.join(' ')} key={i} >
					<div  className={classes.AlbumCover}>
						<img src={albumCovers[i]} alt={titles[i]}/>
					</div>
					
					<div className={classes.TextInfo}>
						<div className={classes.Title}> {titles[i]} </div>
						<div className={classes.Artist}> {artists[i]} </div>
						<div className={classes.AlbumContainer}>
							<div className={classes.Album}> {albums[i]} </div>
							<div className={classes.Year}> {years[i]} </div>
						</div>
					</div>

				</div>
			)
		})
	}
	return (

		<div className={classes.Connection}>
			{connectionComponent}
			<div className={classes.RatingContainer}>
				<Rating rating={rating} small upVotes={upVotes} downVotes={downVotes} />
			</div>
		</div>
	)
}

connection.propTypes = {
	connection: propTypes.object,   		// The connection object
}

export default connection;