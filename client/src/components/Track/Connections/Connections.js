import React from 'react';
import { connect } from 'react-redux';

import * as classes from './Connections.css';
//import * as actions from '../../../store/actions';
	
import Connection from './Connection/Connection';

const connections = props => {
	let connections = null;
	if (props.track) {
		// then we want to map props.track.connectedTracks to 
		// a list of <Connection > components

		// Alternative 
		// - Go through each connection 
		// - Determine which track is the page's track and which is the connected track
		// - Send over each connection to <Connection />


		connections = props.track.connections.map(c => {
			// First determine which track is the connected track by checking against 
			// the spotify_id of props.track which is the page's track

			let connectedTrack = null;
			if (c.tracks[0].spotify_id === props.track.spotify_id) {
				connectedTrack = c.tracks[1];
			} else {
				connectedTrack = c.tracks[0];
			}

			// Once we know which track is the connected track we can pass it along
			// with the connection itself (where we get info like rating, types etc.)
			return <Connection track={connectedTrack} connection={c} key={c._id} />
		})
		/*
		connections = props.track.connectedTracks.map(t => {
			return <Connection track={t} key={t._id} />
		})
		*/
	}

	let header = connections 
		? (
			connections.length === 1 
				? "1 Connected Track" 
				: connections.length + " Connected Tracks"
			)
		: "Connected Tracks";


	return (
		<div className={classes.Connections}>
			<div className={classes.Header}>
				{header}
			</div>
			{connections}
		</div>
	)
}



const mapStateToProps = state => {
	return {
		track: state.track.track,
	}
}
export default connect(mapStateToProps)(connections)	;