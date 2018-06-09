import React from 'react';

import * as classes from './Track.css';

// A multi-purpose track component that takes a few optional props:
// 	- track - populates the content of the track 
//  - yearUnder - If true, the year is placed under the album cover

const track = props => {

	const track = props.track;

	let trackComponent = null;

	let albumCoverClasses = [classes.AlbumCover];

	let title, artist, album, albumCover, year;
	
	if (track) {

		title = track.title;

		artist = track.artist.name;

		album = track.album.name;

		albumCover = track.album.cover_img;

		year = track.album.release_date.split('-')[0];
	

		if (props["small-album"]) albumCoverClasses.push(classes.SmallAlbumCover);

		if (props.coverOutline) albumCoverClasses.push(classes.AlbumOutline);

		trackComponent = 
		(
			<div className={classes.TrackContainer}>

				<div className={classes.AlbumInfo}>

					<div 
						className={albumCoverClasses.join(' ')}
						onClick={() => {if (props.albumClick) props.albumClick(props.trackNum)} }>

						<img src={albumCover} alt={title} />

					</div>

					<div className={classes.Year}> {year} </div>

				</div>

				<div className={classes.TextInfo}>

					<div className={classes.Title}> {title} </div>

					<div className={classes.Artist}> {artist} </div>

					<div className={classes.Album}> {album} </div>
					
				</div>

			</div>

		)

	}

	return (

		<div className={classes.Track}>

			{trackComponent}

		</div>

	)
	
}

export default track;