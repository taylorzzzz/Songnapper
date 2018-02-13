import React from 'react';
import { Link } from 'react-router-dom';

import * as classes from './Connection.css';

const connection = props => {
	let title = props.track ? props.track.title : null;	
	let artist = props.track ? props.track.artist.name : null;
	let album = props.track ? props.track.album.name : null;
	let albumCover = props.track ? props.track.album.cover_img : null;
	return (
		<div className={classes.Connection}>
			<div className={classes.AlbumCover}>
				<img src={albumCover} alt={title} />
			</div>
			<div className={classes.TrackInfo}>
				<Link to={process.env.PUBLIC_URL + '/track/' + props.track.spotify_id} style={{'textDecoration': 'none'}}>
					<div className={classes.TrackTitle}>{title}</div>
				</Link>
				<div className={classes.TrackArtist}>{artist}</div>
				<div className={classes.TrackAlbum}>{album}</div>
			</div>
			<div className={classes.Rating}>
			</div>
		</div>
	)
}

export default connection;