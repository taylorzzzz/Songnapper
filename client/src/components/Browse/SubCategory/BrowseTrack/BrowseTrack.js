import React from 'react';
import { Link } from 'react-router-dom';

import classes from './BrowseTrack.css';

import Track from '../../../UI/Track/Track';

const browseTrack = (props) => {

	return (
		<Link to={`/track/${props.track.spotify_id}`} style={{textDecoration:'none', color:'inherit'}}>
			<div className={classes.BrowseTrack}>
				<Track track={props.track} />
			</div>

		</Link>
	)
}

export default browseTrack;