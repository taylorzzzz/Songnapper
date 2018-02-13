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
		connections = props.track.connectedTracks.map(t => {
			return <Connection track={t} key={t._id} />
		})
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