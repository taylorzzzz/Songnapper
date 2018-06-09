import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as classes from './TrackInfo.css';


const trackInfo = props => {

	let title = props.track 
	
		? props.track.title 
		
		: null;	

	let artist = props.track 
		
		? props.track.artist.name 
		
		: null;

	let album = props.track 
	
		? props.track.album.name 
		
		: null;

	let albumCover = props.track 
		
		? props.track.album.cover_img 
		
		: null;

	let genres = props.track 
		
		? props.track.artist.genres
		
		: null;
		
	let gen = null;

	if (genres) {

		gen = genres.map(g => {

			return (

				<Link 
					to={`${process.env.PUBLIC_URL}/browse/genres/${g}`} 
					className={classes.Genre} 
					key={g}>

					{g}

				</Link>

			)

		})	

	}

	return (

		<div className={classes.TrackInfo}>

			<div className={classes.HeaderContainer}>

				<div className={classes.Header}>

					<div className={classes.Title}>

						{title}

					</div>

					<div className={classes.Artist}>

						{artist}

					</div>

				</div>

				<div className={classes.AlbumCover}>

					<img src={albumCover} alt={title}/> 

				</div>

			</div>

			<div className={classes.Info}>

				<div className={classes.InfoItem}> 

					<span>Title:</span>

					<div className={classes.TrackTitle}>
						
						{title}
					
					</div>

				</div>

				<div className={classes.InfoItem}> 

					<span>Artist:</span>

					<div className={classes.TrackArtist}>
					
						{artist}
						
					</div>

				</div>

				<div className={classes.InfoItem}> 

					<span>Album:</span>

					<div className={classes.TrackAlbum}>
					
						{album}
						
					</div>

				</div>

				<div className={classes.InfoItem}> 

					<span>Genres:</span>

					<div className={classes.TrackGenres}>

						{gen}

					</div>

				</div>

			</div>

		</div>

	)

}

const mapStateToProps = state => {
	return {
		track: state.track.track,
	}
}

export default connect(mapStateToProps)(trackInfo);


