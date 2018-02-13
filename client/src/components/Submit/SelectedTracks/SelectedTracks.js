import React from 'react';
import { connect } from 'react-redux';

import classes from './SelectedTracks.css';
import SelectedTrack from './SelectedTrack/SelectedTrack.js';

const selectedTracks = (props) => {
	return (
		<div className={classes.SelectedTracks}>
			<SelectedTrack 
				track={props.trackSelections[0]} 
				currentTrack={props.currentTrack===1}
				trackNum={1}
				switchTrack={props.switchTrack}/>
				
			<SelectedTrack 
				track={props.trackSelections[1]} 
				currentTrack={props.currentTrack===2}
				trackNum={2}
				switchTrack={props.switchTrack}/>
		</div>
	)
}

const mapStateToProps = state => {
	return {
		alreadyExists: state.submit.connectionAlreadyExists,
	}
}

export default connect(mapStateToProps)(selectedTracks);