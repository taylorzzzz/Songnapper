import React from 'react';
import { connect } from 'react-redux';

import classes from './SearchResult.css';
import * as actions from '../../../../../store/actions';

import Track from '../../../../UI/Track/Track';

const searchResult = (props) => {
	return (
		<div 
			className={classes.SearchResult} 
			onClick={() => props.onSelect(props.currentTrack, props.track)}>
			<Track track={props.track} small-album />
		</div>
	)
}

const mapDispatchToProps = dispatch => {
	return {
		selectTrack: (trackNum, track) => dispatch(actions.selectTrack(trackNum, track))
	}
}
export default connect(null, mapDispatchToProps)(searchResult);

