import React from 'react';
import { Link } from 'react-router-dom';

import * as classes from './Track.css';


const track = props => {


	const track = props.track;

	const title = track.title;
	const artist = track.artist.name;
	const album = track.album.name;
	const albumCover = track.album.cover_img;
	const year = track.album.release_date.split('-')[0];

	const trackComponent = 
	(
		<div className={classes.Track}>

			<div className={classes.AlbumInfo}>
				<Link to={process.env.PUBLIC_URL + '/track/' + props.track.spotify_id}>
					<div className={classes.AlbumCover}>
						<img src={albumCover} alt={title} />
					</div>
				</Link>
				<div className={classes.Year}> {year} </div>
			</div>

			<div className={classes.TextInfo}>
				<div className={classes.Title}> 
					<Link to={process.env.PUBLIC_URL + '/track/' + props.track.spotify_id} style={{'textDecoration': 'none'}}>
						{title}
					</Link>
				</div>
				<div className={classes.Artist}> {artist} </div>
				<div className={classes.Album}> {album} </div>
				<ul className={classes.Genres}>
					{
						track.artist.genres 
							? track.artist.genres.map(g => {
									return (
										<li className={classes.Genre} key={g}>
											<Link to={`${process.env.PUBLIC_URL}/browse/genres/${g}`}>
												{g}
											</Link>
										</li>
									)
								})
							: null
					}
				</ul>
			</div>
		</div>
	)
	return trackComponent ;
}

export default track;